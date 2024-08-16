import express from 'express'
import { Shop } from '../../database/schemas/shopSchema.js'
import { DayBooking } from '../../database/schemas/dayBookingSchema.js'
import { encryptData } from '../../helpers/cryptoProcess.js'
import { UserBooking } from '../../database/schemas/userBookingSchema.js'
import { User } from '../../database/schemas/userSchema.js'
import { MonthBooking } from '../../database/schemas/monthBookingSchema.js'
const adminRouter = express.Router()

// Changin status for shop opening or closing
adminRouter.post('/change-status',async(req,res)=>{
    const shop = await Shop.findOne({shopID:1})
    shop.shopStatus = !req.body.statusData
    await shop.save()
    res.json({
        status:true,
        newStatus:!req.body.statusData,
        message:"shopStatus was updated"
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
    if(latestRecord === null || latestRecord.isClosed === true){
        res.json({
            status:true,
            dailyQue:encryptData([])
            
        })
    }else{
        const responseArray = []
        for(const userBookingID of latestRecord.usersBooking){
            const currentUserBooking = await UserBooking.findOne({userBookingID:userBookingID})
            const currentUser = await User.findOne({userID:currentUserBooking.userID})
            const responseData = {
                name:currentUser.name,
                phoneNumber:currentUser.phoneNumber,
                comingWith:currentUserBooking.comingWith,
                userBookingID:userBookingID
            }
            responseArray.push(responseData)
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
    console.log(req.params.userBookingID)
    const latestRecord = await DayBooking.findOne().sort({existDayDate : -1})
    const latestMonthRecord = await MonthBooking.findOne().sort({existDayDate : -1})
    
    const currentUserBooking = await UserBooking.findOne({userBookingID:Number(req.params.userBookingID)})
    const cutType = currentUserBooking.cutType
    const comingWith = currentUserBooking.comingWith
    const shop = await Shop.findOne() 
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
    latestRecord.usersBooking = latestRecord.usersBooking.filter( id => id !== Number(req.params.userBookingID))
    await currentUser.save()
    await latestRecord.save()
    await latestMonthRecord.save()
    res.json({
        status:true,
        userBookingID:Number(req.params.userBookingID),
        bookingToken:currentUserBooking.bookingToken,
        finishCutDatas:{
            cutType:cutType,
            cutPrice:shop.cutPrice,
            cutBPrice:shop.cutBPrice
        }
    })
})
export default adminRouter;

