import express from 'express'
import { getTokenforAdmin, getTokenforQue } from '../../helpers/jwtProcesses.js'
import { Shop } from '../../database/schemas/shopSchema.js';
import { User } from '../../database/schemas/userSchema.js';
import { DayBooking } from '../../database/schemas/dayBookingSchema.js';
import { encryptData } from '../../helpers/cryptoProcess.js';
import { MonthBooking } from '../../database/schemas/monthBookingSchema.js';
import { UserBooking } from '../../database/schemas/userBookingSchema.js';
const publicRouter = express.Router()

//Create a admin access token and send to ui 
publicRouter.get('/adminLogin',(req,res)=>{
    const adminAccessToken = getTokenforAdmin()
    res.json({
        status:true,
        adminAccessToken:adminAccessToken
    })
})


//Learn the shop open or close
publicRouter.get('/shopStatus',async (req,res)=>{
    const shop = await Shop.findOne({shopID:1})
    if(!shop){
        await new Shop({
            shopStatus:false,
            cutPrice:200,
            cutBPrice:250,
            showMessage:""
        }).save()
        res.json({
            status:true,
            shopStatus:false
        })
    }else{
        res.json({
            status:true,
            shopStatus: shop.shopStatus
        })
    }

})

// User register 
publicRouter.post('/register-user', async (req,res) => {
    const user = await User.findOne({phoneNumber:req.body.data.phoneNumber})
    const now = new Date();
    const offset = now.getTimezoneOffset()
    const localDate = new Date(now.getTime() - (offset * 60 * 1000))  
    if(!user){
        // new user record
        const updatedUser = await new User({
            name:req.body.data.name,
            phoneNumber:req.body.data.phoneNumber,
            existTime:localDate
        }).save()

        //new user booking record
        const bookingToken = getTokenforQue()
        const newUserBooking = await new UserBooking({
            userID:updatedUser.userID,
            cutType:req.body.data.cutType,
            comingWith:req.body.data.comingWithValue,
            bookingToken:bookingToken,
            registerTime:localDate

        }).save()
        console.log('if blogu updated user: ', newUserBooking)
        res.json({
            status:true,
            queueToken:bookingToken,
            userDatas: {
                name:req.body.data.name,
                cutType:req.body.data.cutType,
                comingWith:req.body.data.comingWithValue
            }
        })
    }else{
        //update user
        user.name = req.body.data.name
        const updatedUser = await user.save()

        // new user booking
        const bookingToken = getTokenforQue()
        const newUserBooking = await new UserBooking({
            userID:updatedUser.userID,
            cutType:req.body.data.cutType,
            comingWith:req.body.data.comingWithValue,
            bookingToken:bookingToken,
            registerTime:localDate

        }).save()
        console.log('else blogu updated user: ', newUserBooking)

        res.json({
            status:true,
            queueToken:bookingToken,
            userDatas: {
                name:req.body.data.name,
                cutType:req.body.data.cutType,
                comingWith:req.body.data.comingWithValue
            }
        })

    }
})

// If exists get daily booking or create new one
publicRouter.get('/get-dailyBooking', async (req,res) => {
    const now = new Date();
    // It is giving difference between UTC time and local time in type of minute so now its logging -180 
    const offset = now.getTimezoneOffset()
    // Translating to local date
    const localDate = new Date(now.getTime() - (offset * 60 * 1000))
    const monthDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1))
    const latestRecord = await DayBooking.findOne().sort({existDayDate : -1})

    // getting latest dayBooking data foor check is over or not
    if(latestRecord === null || latestRecord.isClosed === true){
        const newDayBooking = await new DayBooking({
            existDayDate :  localDate
        }).save()        
        const currentMonthRecord = await MonthBooking.findOne({existMonthDate:monthDate})

        // Checking current moonth exist or not then to save new day booking into it
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
            dailyQue:encryptData(newDayBooking.usersBooking),
            dayBookingID: encryptData(newDayBooking.dayBookingID)
        })
    }else{
        res.json({
            status: true,
            dailyQue : encryptData(latestRecord.usersBooking),
            dayBookingID: encryptData(latestRecord.dayBookingID)
        })
    }
    
})


publicRouter.get('/close-dailyBooking' , async (req,res) => {
    const latestRecord = await DayBooking.findOne().sort({existDayDate : -1})
    if(latestRecord.isClosed === false){
        const shop = await Shop.findOne({shopID:1})
        latestRecord.dailyPaid += shop.cutPrice * latestRecord.cutCount
        latestRecord.dailyPaid += shop.cutBPrice * latestRecord.cutBCount
        latestRecord.isClosed = true
        await latestRecord.save()
    }
    res.json({
        status:true
    })
})

export default publicRouter