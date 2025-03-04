const express = require('express');
const { Shop } = require('../../database/schemas/shopSchema.js');
const { DayBooking } = require('../../database/schemas/dayBookingSchema.js');
const { encryptData } = require('../../helpers/cryptoProcess.js');
const { UserBooking } = require('../../database/schemas/userBookingSchema.js');
const { User } = require('../../database/schemas/userSchema.js');
const { MonthBooking } = require('../../database/schemas/monthBookingSchema.js');
const { getIO } = require('../../helpers/socketio.js');
const { Admin } = require('../../database/schemas/adminSchema.js');
const { RequestCounter } = require('../../database/schemas/requestCounterSchema.js');
const webpush = require('web-push');
const adminRouter = express.Router()

// Changin status for shop opening or closing
adminRouter.post('/change-status',async(req,res)=>{
    const shop = await Shop.findOne({shopID:1})
    await RequestCounter.deleteMany({})
    
    shop.shopStatus = !req.body.statusData
    await shop.save()

    if(!req.body.statusData === false){
        const latestDayRecord = await DayBooking.findOne().sort({existDayDate : -1})
        latestDayRecord.isClosed = true
        await latestDayRecord.save()
        // when shop was closed then open the order feature
        shop.orderFeature = true
        await shop.save()

        res.json({
            status:true,
            newStatus:!req.body.statusData,
            message:"shopStatus was updated",
        })
    }else{
        shop.costumOpeningDate = null
        shop.costumFormattedOpeningDate = null
        await shop.save()
        const now = new Date()
        // It is giving difference between UTC time and local time in type of minute so now its logging -180 
        const offset = now.getTimezoneOffset()
        const localDate = new Date(now.getTime() - (offset * 60 * 1000))
        const newDayBooking = await new DayBooking({
            existDayDate :  localDate
        }).save()

        const monthDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1))
        const currentMonthRecord = await MonthBooking.findOne({existMonthDate:monthDate})
        // Checking current month exist or not then to save new day booking into it
        if(currentMonthRecord){
            currentMonthRecord.dayBooking.push(newDayBooking.dayBookingID)
            await currentMonthRecord.save()
        }        
        else{
            const newMonthRecord = await new MonthBooking({
                existMonthDate: monthDate
            })
            newMonthRecord.dayBooking.push(newDayBooking.dayBookingID)
            await newMonthRecord.save()
        }

        res.json({
            status:true,
            newStatus:!req.body.statusData,
            message:"shopStatus was updated"
        })        
    }
    getIO().emit('changedStatus', !req.body.statusData)

})

// We are changing  the order feature 
adminRouter.post('/change-order-feature', async (req,res) => {
    const shop = await Shop.findOne({shopID:1})
    shop.orderFeature = !req.body.orderFeature
    getIO().emit('changeOrderFeature', !req.body.orderFeature)
    await shop.save()
    res.json({
        newOrderFeature : !req.body.orderFeature
    })
})
// We just check the admin access token for show other admin utilities
adminRouter.get('/controlAdminAccessToken', async(req,res)=>{
    res.json({
        status:true,
        message:"Token is valid"
    })
})

// Sending daily booking for admin
adminRouter.get('/get-dailyBooking', async (req,res) => {
    const latestRecord = await DayBooking.findOne().sort({existDayDate : -1})
    const shop = await Shop.findOne()
    if(latestRecord === null || latestRecord.isClosed === true){
        res.json({
            status:true,
            dailyQue:null
        })
    }else{
        const now = new Date()
        const offset = now.getTimezoneOffset()
        const responseArray = []
        for(const userBookingID of latestRecord.usersBooking){
            const currentUserBooking = await UserBooking.findOne({userBookingID:userBookingID})
            const service = shop.services.find(service => service.serviceID == currentUserBooking.serviceID)

            const shownDate = new Date(currentUserBooking.registerTime.getTime() +(offset * 60 * 1000))
            const day = String(shownDate.getDate()).padStart(2, '0');
            const month = String(shownDate.getMonth() + 1).padStart(2, '0');
            const year = String(shownDate.getFullYear()).slice(-2);
            const hours = String(shownDate.getHours()).padStart(2, '0');
            const minutes = String(shownDate.getMinutes()).padStart(2, '0');
            const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;
            

            if(currentUserBooking.userID === undefined){
                const responseData = {
                    name:currentUserBooking.name,
                    phoneNumber:null,
                    comingWith:currentUserBooking.comingWith,
                    userBookingID:userBookingID,
                    service:{
                        name:service.name,
                        estimatedTime:service.estimatedTime
                    },
                    shownDate:formattedDate
                }
                responseArray.push(responseData)
            }else{
                const currentUser = await User.findOne({userID:currentUserBooking.userID})
                const responseData = {
                    name:currentUser.name,
                    phoneNumber:currentUser.phoneNumber,
                    comingWith:currentUserBooking.comingWith,
                    userBookingID:userBookingID,
                    service:{
                        name:service.name,
                        estimatedTime:service.estimatedTime
                    },
                    shownDate:formattedDate
                }
                responseArray.push(responseData)
            }
        }
        res.json({
            status: true,
            dailyQue : encryptData(responseArray)
            
        })
    }
})

// Remove user from que 
adminRouter.delete('/delete-user-admin-que/:userBookingID', async (req,res) => {
    const userBookingID = Number(req.params.userBookingID)
    const latestRecord = await DayBooking.findOne().sort({existDayDate : -1})
    latestRecord.usersBooking = latestRecord.usersBooking.filter( id => id !== userBookingID)
    await latestRecord.save()
    const currentUserBooking = await UserBooking.findOne({userBookingID:userBookingID})
    getIO().emit('remove',{userBookingID:userBookingID,bookingToken:currentUserBooking.bookingToken})
    res.json({
        status:true,
        userBookingID:userBookingID
    })
})


adminRouter.put('/finish-cut/:userBookingID', async (req,res) => {
    const latestRecord = await DayBooking.findOne().sort({existDayDate : -1})
    const latestMonthRecord = await MonthBooking.findOne().sort({existMonthDate : -1})
    const shop = await Shop.findOne() 

    const currentUserBooking = await UserBooking.findOne({userBookingID:Number(req.params.userBookingID)})
    const service = shop.services.find(service => service.serviceID == currentUserBooking.serviceID)
    const comingWith = currentUserBooking.comingWith

    const dailyService = latestRecord.dailyCount.find( count => count.serviceID == service.serviceID)
    const monthlyService = latestMonthRecord.monthlyCount.find( count => count.serviceID == service.serviceID)

    if(currentUserBooking.userID){
        const currentUser = await User.findOne({userID:currentUserBooking.userID})

        const userService = currentUser.userCount.find( count => count.serviceID == service.serviceID)
        userService ? userService.count += 1 : currentUser.userCount.push({
            serviceID: service.serviceID,
            count:1
        })
        const userDefaultService = currentUser.userCount.find(count => count.serviceID == shop.services[0].serviceID)
        userDefaultService ? userDefaultService.count += (comingWith - 1) : currentUser.userCount.push({
            serviceID: shop.services[0].serviceID,
            count: comingWith - 1
        })

        currentUser.paid += (service.amount + (comingWith - 1) * shop.services[0].amount)

        await currentUser.save()
    }

    dailyService ? dailyService.count += 1 : latestRecord.dailyCount.push({
        serviceID:service.serviceID,
        count:1
    })
    const dailyDefaultService = latestRecord.dailyCount.find(count => count.serviceID == shop.services[0].serviceID)
    dailyDefaultService ? dailyDefaultService.count += (comingWith - 1) : latestRecord.dailyCount.push({
        serviceID: shop.services[0].serviceID,
        count: comingWith - 1
    })
    latestRecord.dailyPaid += (service.amount + (comingWith - 1) * shop.services[0].amount)


    monthlyService ? monthlyService.count += 1 : latestMonthRecord.monthlyCount.push({
        serviceID:service.serviceID,
        count :1
    })
    const monthlyDefaultService = latestMonthRecord.monthlyCount.find(count => count.serviceID == shop.services[0].serviceID)
    monthlyDefaultService ? monthlyDefaultService.count += (comingWith - 1) : latestMonthRecord.monthlyCount.push({
        serviceID: shop.services[0].serviceID,
        count: comingWith - 1
    })
    latestMonthRecord.monthlyPaid += (service.amount + (comingWith - 1) * shop.services[0].amount)
    

    latestRecord.usersBooking = latestRecord.usersBooking.filter( id => id !== Number(req.params.userBookingID))
    await latestRecord.save()
    await latestMonthRecord.save()
    
    // These are for shown stats on ui
    let income = service.amount
    income +=  (comingWith - 1) * shop.services[0].amount
    
    getIO().emit('finished-cut',{userBookingID:Number(req.params.userBookingID),bookingToken:currentUserBooking.bookingToken})
    res.json({
        status:true,
        userBookingID:Number(req.params.userBookingID),
        bookingToken:currentUserBooking.bookingToken,
        finishedDatas:{
            serviceName:service.name,
            income,
            comingWith:comingWith
        }
    })
})

adminRouter.put('/up-move', async (req,res) => {
    const currentIndex = req.body.index
    const latestRecord = await DayBooking.findOne().sort({existDayDate : -1})
    
    const temp = latestRecord.usersBooking[currentIndex - 1]
    latestRecord.usersBooking[currentIndex - 1] = latestRecord.usersBooking[currentIndex]
    latestRecord.usersBooking[currentIndex] = temp

    await latestRecord.save()

    getIO().emit('up-moved',currentIndex)
    res.json({
        status:true,
        index:currentIndex
    })
})


adminRouter.put('/down-move', async (req,res) => {
    const currentIndex = req.body.index
    const latestRecord = await DayBooking.findOne().sort({existDayDate : -1})
    
    const temp = latestRecord.usersBooking[currentIndex + 1]
    latestRecord.usersBooking[currentIndex + 1] = latestRecord.usersBooking[currentIndex]
    latestRecord.usersBooking[currentIndex] = temp

    await latestRecord.save()

    getIO().emit('down-moved',currentIndex)
    res.json({
        status:true,
        index:currentIndex
    })
})


adminRouter.post('/fast-register',async (req,res) => {
    const shop = await Shop.findOne() 
    // date 
    const now = new Date();
    const offset = now.getTimezoneOffset()
    const localDate = new Date(now.getTime() - (offset * 60 * 1000))
    // shown date on admin
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;

    const latestRecord = await DayBooking.findOne().sort({existDayDate : -1})
    // new user booking
    const newUserBooking = await new UserBooking({
        name:req.body.name,
        serviceID:shop.services[0].serviceID,
        comingWith:1,
        bookingToken:null,
        registerTime:localDate
    }).save()
    latestRecord.usersBooking.push(newUserBooking.userBookingID)

    await latestRecord.save()

    const fastUserDatas = encryptData({
        name:req.body.name,
        service:{
            name:shop.services[0].name,
            estimatedTime:shop.services[0].estimatedTime
        },
        comingWith:1,
        userBookingID:newUserBooking.userBookingID,
        phoneNumber:null,
        shownDate:formattedDate
    })

    getIO().emit('fastUser-register',fastUserDatas)
    res.json({
        status:true,
        fastUserDatas
    })
})

// increase amount as costum on ui
adminRouter.post('/increase-amount', async (req,res) => {
    const amount = Number(req.body.amount)
    const latestDayRecord = await DayBooking.findOne().sort({existDayDate : -1})
    const latestMonthRecord = await MonthBooking.findOne().sort({existMonthDate : -1})

    latestDayRecord.dailyPaid += amount
    latestMonthRecord.monthlyPaid += amount

    await latestDayRecord.save()
    await latestMonthRecord.save()
    res.json({
        status:true,
        increasedAmount:amount
    })
})

// decrease amount as costum on ui
adminRouter.post('/decrease-amount', async (req,res) => {
    const amount = Number(req.body.amount)
    const latestDayRecord = await DayBooking.findOne().sort({existDayDate : -1})
    const latestMonthRecord = await MonthBooking.findOne().sort({existMonthDate : -1})

    latestDayRecord.dailyPaid -= amount
    latestMonthRecord.monthlyPaid -= amount

    await latestDayRecord.save()
    await latestMonthRecord.save()
    res.json({
        status:true,
        decreasedAmount:amount
    })
})



// get shop settings for shoow on admin ui
adminRouter.get('/get-shop-settings', async (req,res) => {
    const shop = await Shop.findOne()
    res.json({
        status:true,
        showMessage:shop.showMessage,
        costumFormattedOpeningDate:shop.costumFormattedOpeningDate,
        services : shop.services
    })
})

// delete published message
adminRouter.delete('/delete-message', async (req,res) => {
    const shop = await Shop.findOne()
    shop.showMessage = null
    await shop.save()
    getIO().emit('deleted-message')
    res.json({
        status:true
    })
}
)

// add message to shop 
adminRouter.post('/add-message' , async (req,res) => {
    const shop = await Shop.findOne()
    shop.showMessage = req.body.message
    await shop.save()
    getIO().emit('sended-message', req.body.message)
    res.json({
        status:true,
        message:req.body.message
    })
})

// get all stats
adminRouter.get('/get-stats', async (req,res) => {
    // date 
    const now = new Date()
    const offset = now.getTimezoneOffset()
    
    const localNowDate = new Date(now.getTime() - (offset * 60 * 1000))
    const aWeekAgoDate = new Date(localNowDate.getTime() - (  7 * 24 * 60 * 60 * 1000))
    const lastYearDate = new Date();
    lastYearDate.setFullYear(localNowDate.getFullYear() - 1);

    let latestDailyRecord = await DayBooking.findOne().sort({existDayDate : -1}) 
    // This if for creating new monthRecord when you set up the app first time
    if(!latestDailyRecord) {
        latestDailyRecord = await new DayBooking({
            existDayDate:localNowDate
        }).save()
    }
    const weeklyRecords = await DayBooking.find({
        existDayDate:{
            $gte: aWeekAgoDate,
            $lt:localNowDate 
        }
    })

    let latestMonthRecord = await MonthBooking.findOne().sort({existMonthDate : -1})
    // This if for creating new monthRecord when you set up the app first time
    if(!latestMonthRecord) {
        const monthDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1))
        latestMonthRecord = await new MonthBooking({
            existMonthDate:monthDate
        }).save()
    }
    const yearlyRecords = await MonthBooking.find({
        existMonthDate:{
            $gte: lastYearDate,
            $lt:localNowDate
        }
    })

    const shop = await Shop.findOne()

    let dailyCounts = []
    let dailyIncome = 0
        shop.services.forEach( service => {
        const dailyService = latestDailyRecord.dailyCount.find( dailyCountService => dailyCountService.serviceID === service.serviceID)
        if (dailyService == undefined){
            dailyCounts.push({
                name:service.name,
                count:0
            })
        }else{
            dailyCounts.push({
                name:service.name,
                count:dailyService.count
            })
            dailyIncome += service.amount * dailyService.count
        }
    })
    let weeklyCounts = []
    let weeklyIncome = 0

    shop.services.forEach( service => {
        weeklyCounts.push({
            serviceID:service.serviceID,
            name:service.name,
            count:0
        })
    })

    weeklyRecords.forEach( dayRecord => {
        dayRecord.dailyCount.forEach( dayService => {
            const existService = weeklyCounts.find( weeklyService => weeklyService.serviceID == dayService.serviceID)
            if(existService) existService.count += dayService.count
        })
        weeklyIncome += dayRecord.dailyPaid
    })

    //let montlyCount = []
/*     shop.services.find(service => {
        const monthService = latestMonthRecord.monthlyCount.find( monthCountService => monthCountService.serviceID == service.serviceID)
        if(monthService == undefined){
            montlyCount.push({
                name:service.name,
                count:0
            })
        }else{
            montlyCount.push({
                name:service.name,
                count:monthService.count
            })
            monthlyIncome += monthService.count * service.amount
        }
    }) */

    let yearlyIncome = 0
    yearlyRecords.forEach(month => {
        yearlyIncome += month.monthlyPaid
    })

    res.json({
        status:true,
        stats:encryptData({
            daily:{
                dailyCounts,
                dailyIncome:latestDailyRecord.dailyPaid
            },
            weekly:{
                weeklyCounts,
                weeklyIncome:weeklyIncome
            },
            monthlyIncome:latestMonthRecord.monthlyPaid,
            yearlyIncome
        })
    })
})

// Setting time fir costum opening  shop
adminRouter.post('/set-time', async (req,res) => {
    const shop = await Shop.findOne()
    const setDate  = new Date(req.body.date)
    shop.costumOpeningDate = setDate
    // Date format processes 
    const localDate = new Date(setDate.getTime() + (setDate.getTimezoneOffset() * 60000));
    const day = localDate.getDate().toString().padStart(2,'0')
    const month = (localDate.getMonth() + 1).toString().padStart(2,'0')
    const year = localDate.getFullYear()

    const hours = localDate.getHours().toString().padStart(2,'0')
    const minutes = localDate.getMinutes().toString().padStart(2,'0')

    const dayName = localDate.toLocaleDateString('tr-TR', { weekday: 'long' })

    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes} ${dayName}`

    shop.costumFormattedOpeningDate = formattedDate
    await shop.save()
    getIO().emit('set-oto-opening-time',{set:true,date:shop.costumOpeningDate})
    res.json({
        status:true,
        formattedDate,
        date:shop.costumOpeningDate
    })

})
adminRouter.delete('/cancel-costum-open', async (req,res) => {
    const shop = await Shop.findOne()

    shop.costumOpeningDate = null
    shop.costumFormattedOpeningDate = null

    await shop.save()

    getIO().emit('set-oto-opening-time',{set:false,date:null})
    res.json({
        status:true
    })
})

// Add service 
adminRouter.post('/add-service', async (req,res) => {
    const shop = await Shop.findOne()
    !shop.serviceIDCounter ? shop.serviceIDCounter = 1 : shop.serviceIDCounter += 1
    if(shop.services){
        shop.services.push({serviceID:shop.serviceIDCounter,name:req.body.name,estimatedTime:req.body.estimatedTime,amount:req.body.amount})
    }else{
        shop.services = new Array()
        shop.services.push({serviceID:shop.serviceIDCounter,name:req.body.name,estimatedTime:req.body.estimatedTime,amount:req.body.amount})
    }
    await shop.save()
    res.json({
        status:true,
        newService:{serviceID:shop.serviceIDCounter,name:req.body.name,estimatedTime:req.body.estimatedTime,amount:req.body.amount}
    })
})

// Delete Service
adminRouter.post('/delete-service', async (req,res) => {
    const shop = await Shop.findOne()
    shop.services = [...shop.services].filter((service) => service.serviceID !== req.body.serviceID)
    await shop.save()
    res.json({
        status:true,
        newServices: shop.services
    })
})

// Subscribe admin user for notification
adminRouter.post('/subscribe-notification', async (req,res) => {
    await Admin.updateOne({},{ $set : {subscription : req.body.subscription}})
    res.json({status:true,message:'Subscription was success!'})
})

// Costum message send
adminRouter.post('/send-costum-notification', async (req,res) => {
    const adminDoc = await Admin.findOne({})
    const payload = JSON.stringify({
        title: req.body.title,
        body: req.body.body,
    })
    try{
        webpush.sendNotification(adminDoc.subscription, payload)
    }catch(err){
        console.err('There is an notification err: ',err)
    }
    res.json({
        message:'Notification was send!'
    })
} )

module.exports = adminRouter;