const express = require('express');
const { Shop } = require('../../database/schemas/shopSchema.js');
const { DayBooking } = require('../../database/schemas/dayBookingSchema.js');
const { encryptData } = require('../../helpers/cryptoProcess.js');
const { UserBooking } = require('../../database/schemas/userBookingSchema.js');
const { User } = require('../../database/schemas/userSchema.js');
const { MonthBooking } = require('../../database/schemas/monthBookingSchema.js');
const adminRouter = express.Router()

// Changin status for shop opening or closing
adminRouter.post('/change-status',async(req,res)=>{
    const shop = await Shop.findOne({shopID:1})
    shop.shopStatus = !req.body.statusData
    await shop.save()
    if(!req.body.statusData === false){
        const latestDayRecord = await DayBooking.findOne().sort({existDayDate : -1})
        latestDayRecord.isClosed = true
        await latestDayRecord.save()
        res.json({
            status:true,
            newStatus:!req.body.statusData,
            message:"shopStatus was updated",
        })
    }else{
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
    if(latestRecord === null || latestRecord.isClosed === true){
        res.json({
            status:true,
            dailyQue:encryptData([])
        })
    }else{
        const now = new Date()
        const offset = now.getTimezoneOffset()
        const responseArray = []
        for(const userBookingID of latestRecord.usersBooking){
            const currentUserBooking = await UserBooking.findOne({userBookingID:userBookingID})

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
                    cutType:currentUserBooking.cutType,
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
                    cutType:currentUserBooking.cutType,
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
    res.json({
        status:true,
        userBookingID:userBookingID,
        bookingToken:currentUserBooking.bookingToken
    })
})


adminRouter.put('/finish-cut/:userBookingID', async (req,res) => {
    const latestRecord = await DayBooking.findOne().sort({existDayDate : -1})
    const latestMonthRecord = await MonthBooking.findOne().sort({existMonthDate : -1})
    
    const currentUserBooking = await UserBooking.findOne({userBookingID:Number(req.params.userBookingID)})
    const cutType = currentUserBooking.cutType
    const comingWith = currentUserBooking.comingWith
    const shop = await Shop.findOne() 
    
    if(currentUserBooking.userID === undefined){
        latestRecord.cutCount += 1
        latestRecord.dailyPaid += shop.cutPrice

        latestMonthRecord.cutCount += 1
        latestMonthRecord.monthlyPaid += shop.cutPrice    
    }else{
        const currentUser = await User.findOne({userID:currentUserBooking.userID})
        
        const additionalExtraPerson = comingWith - 1 
        const aditionalExtraPaid = comingWith === 2 ? shop.cutPrice : comingWith === 3 ? shop.cutPrice * 2 : comingWith === 4 ? shop.cutPrice * 3 : 0
        if(cutType === 'cut'){
            currentUser.cutCount += comingWith
            currentUser.paid += (shop.cutPrice + aditionalExtraPaid)

            latestRecord.cutCount += comingWith
            latestRecord.dailyPaid += (shop.cutPrice + aditionalExtraPaid)

            latestMonthRecord.cutCount += comingWith
            latestMonthRecord.monthlyPaid += (shop.cutPrice + aditionalExtraPaid)
        }else{
            currentUser.cutBCount += 1
            currentUser.cutCount += additionalExtraPerson
            currentUser.paid += (shop.cutBPrice + aditionalExtraPaid)

            latestRecord.cutBCount += 1
            latestRecord.cutCount += additionalExtraPerson
            latestRecord.dailyPaid += (shop.cutBPrice + aditionalExtraPaid)
            
            latestMonthRecord.cutBCount += 1
            latestMonthRecord.cutCount += additionalExtraPerson
            latestMonthRecord.monthlyPaid += (shop.cutBPrice + aditionalExtraPaid)
        }
        await currentUser.save()       
    }

    latestRecord.usersBooking = latestRecord.usersBooking.filter( id => id !== Number(req.params.userBookingID))
    await latestRecord.save()
    await latestMonthRecord.save()
    
    // These are for shown stats on ui
    let income = currentUserBooking.cutType === 'cut' ? shop.cutPrice : shop.cutBPrice
    income +=  (currentUserBooking.comingWith - 1) * shop.cutPrice
    
    res.json({
        status:true,
        userBookingID:Number(req.params.userBookingID),
        bookingToken:currentUserBooking.bookingToken,
        finishedDatas:{
            cutType:cutType,
            income:income,
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

    res.json({
        status:true,
        index:currentIndex
    })
})


adminRouter.post('/fast-register',async (req,res) => {
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
        cutType:'cut',
        comingWith:1,
        bookingToken:null,
        registerTime:localDate
    }).save()
    latestRecord.usersBooking.push(newUserBooking.userBookingID)

    await latestRecord.save()
    res.json({
        status:true,
        fastUserDatas: encryptData({
            name:req.body.name,
            cutType:'cut',
            comingWith:1,
            userBookingID:newUserBooking.userBookingID,
            phoneNumber:null,
            shownDate:formattedDate
        })
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

// raise our service which is selectted on ui
adminRouter.put('/raise-price',async (req,res) => {
    const shop = await Shop.findOne()
    if(req.body.service === 'cut'){
        shop.cutPrice += Number(req.body.raisePrice)
    }else{
        shop.cutBPrice += Number(req.body.raisePrice)
    }

    await shop.save()
    res.json({
        status:true,
        cutPrice:shop.cutPrice,
        cutBPrice:shop.cutBPrice
    })
})

// discount our service which is selectted on ui
adminRouter.put('/discount-price',async (req,res) => {
    const shop = await Shop.findOne()
    if(req.body.service === 'cut'){
        shop.cutPrice -= Number(req.body.discountPrice)
    }else{
        shop.cutBPrice -= Number(req.body.discountPrice)
    }

    await shop.save()
    res.json({
        status:true,
        cutPrice:shop.cutPrice,
        cutBPrice:shop.cutBPrice
    })
})

// get shop settings for shoow on admin ui
adminRouter.get('/get-shop-settings', async (req,res) => {
    const shop = await Shop.findOne()

    res.json({
        status:true,
        cutPrice:shop.cutPrice,
        cutBPrice:shop.cutBPrice,
        showMessage:shop.showMessage
    })
})

// delete published message
adminRouter.delete('/delete-message', async (req,res) => {
    const shop = await Shop.findOne()
    shop.showMessage = null
    await shop.save()
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

    const latestDailyRecord = await DayBooking.findOne().sort({existDayDate : -1}) 
    const weeklyRecords = await DayBooking.find({
        existDayDate:{
            $gte: aWeekAgoDate,
            $lt:localNowDate 
        }
    })

    if(latestDailyRecord === null){
        res.json({
            status:true,
            stats:encryptData({
                daily:{
                    income:0,
                    cutCount:0,
                    cutBCount:0
                },
                weekly : {
                    income :0,
                    cutCount : 0,
                    cutBCount : 0
                },
                monthlyIncome : 0,
                yearlyIncome : 0            
            }
        )})
    }else{
        let weeklyIncome = 0
        let weeklyCCount = 0
        let weeklyCBCount = 0
        weeklyRecords.forEach(day => {
            weeklyIncome += day.dailyPaid
            weeklyCCount += day.cutCount
            weeklyCBCount += day.cutBCount

        });
        const latestMonthRecord = await MonthBooking.findOne().sort({existMonthDate : -1})
        const yearlyRecords = await MonthBooking.find({
            existMonthDate:{
                $gte: lastYearDate,
                $lt:localNowDate
            }
        })
        
        let yearlyIncome = 0
        yearlyRecords.forEach(month => {
            yearlyIncome += month.monthlyPaid
        });
        
        
        res.json({
            status:true,
            stats:encryptData({
                daily:{
                    income:latestDailyRecord.dailyPaid,
                    cutCount:latestDailyRecord.cutCount,
                    cutBCount:latestDailyRecord.cutBCount
                },
                weekly : {
                    income : weeklyIncome,
                    cutCount : weeklyCCount,
                    cutBCount : weeklyCBCount
                },
                monthlyIncome : latestMonthRecord.monthlyPaid,
                yearlyIncome : yearlyIncome            
            }
        )})        
    }


})
module.exports = adminRouter;