import express from 'express'
import { getTokenforAdmin, getTokenforQue, verificationQueToken } from '../../helpers/jwtProcesses.js'
import { Shop } from '../../database/schemas/shopSchema.js';
import { User } from '../../database/schemas/userSchema.js';
import { DayBooking } from '../../database/schemas/dayBookingSchema.js';
import { encryptData } from '../../helpers/cryptoProcess.js';
import { MonthBooking } from '../../database/schemas/monthBookingSchema.js';
import { UserBooking } from '../../database/schemas/userBookingSchema.js';
import { Admin } from '../../database/schemas/adminSchema.js';

const publicRouter = express.Router()

//Learn the shop open or close
publicRouter.get('/shopStatus',async (req,res)=>{
    const shop = await Shop.findOne({shopID:1})
    if(!shop){
        await new Shop({
            shopStatus:false,
            cutPrice:200,
            cutBPrice:250,
            showMessage:null
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

//Learn the shop open or close
publicRouter.get('/getShopStatus',async (req,res)=>{
    const shop = await Shop.findOne({shopID:1})
    res.json({
        status:true,
        shopStatus: shop.shopStatus
    })
})

// User register 
publicRouter.post('/register-user', async (req,res) => {
    const user = await User.findOne({phoneNumber:req.body.data.phoneNumber})
    // date 
    const now = new Date();
    const offset = now.getTimezoneOffset()
    const localDate = new Date(now.getTime() - (offset * 60 * 1000))

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;
    // get current daily shop
    const lastDayBooking = await DayBooking.findOne().sort({existDayDate : -1})
    if(!user){
        // new user record
        const updatedUser = await new User({
            name:req.body.data.name,
            phoneNumber:req.body.data.phoneNumber,
            existTime:localDate
        }).save()

        //new user booking record
        const newUserBooking = await new UserBooking({
            userID:updatedUser.userID,
            cutType:req.body.data.cutType,
            comingWith:req.body.data.comingWithValue,
            bookingToken:null,
            registerTime:localDate

        }).save()
        const bookingToken = getTokenforQue(newUserBooking.userBookingID,lastDayBooking.dayBookingID)
        newUserBooking.bookingToken = bookingToken
        await newUserBooking.save()
        //push to que new user
        lastDayBooking.usersBooking.push(newUserBooking.userBookingID)
        await lastDayBooking.save()
        
        

        res.json({
            status:true,
            queueToken:bookingToken,
            userDatas: encryptData(
                {
                    name:req.body.data.name,
                    cutType:req.body.data.cutType,
                    comingWith:req.body.data.comingWithValue,
                    userBookingID:newUserBooking.userBookingID,
                    phoneNumber:req.body.data.phoneNumber,
                    shownDate:formattedDate
                }
            )
        })
    }else{
        //update user
        user.name = req.body.data.name
        const updatedUser = await user.save()

        // new user booking
        const newUserBooking = await new UserBooking({
            userID:updatedUser.userID,
            cutType:req.body.data.cutType,
            comingWith:req.body.data.comingWithValue,
            bookingToken:null,
            registerTime:localDate

        }).save()
        const bookingToken = getTokenforQue(newUserBooking.userBookingID,lastDayBooking.dayBookingID)
        newUserBooking.bookingToken = bookingToken
        await newUserBooking.save()
        //push to que new user
        lastDayBooking.usersBooking.push(newUserBooking.userBookingID)
        await lastDayBooking.save()

        res.json({
            status:true,
            queueToken:bookingToken,
            userDatas: encryptData(
                {
                    name:req.body.data.name,
                    cutType:req.body.data.cutType,
                    comingWith:req.body.data.comingWithValue,
                    userBookingID:newUserBooking.userBookingID,
                    phoneNumber:req.body.data.phoneNumber,
                    shownDate:formattedDate
                }
            )
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
        const responseArray = []
        for(const userBookingID of latestRecord.usersBooking){
            const currentUserBooking = await UserBooking.findOne({userBookingID:userBookingID})
            if(currentUserBooking.userID === undefined){
                const responseData = {
                    name:currentUserBooking.name,
                    cutType:currentUserBooking.cutType,
                    comingWith:currentUserBooking.comingWith,
                    userBookingID:userBookingID
                }
                responseArray.push(responseData)
            }else{
                const currentUser = await User.findOne({userID:currentUserBooking.userID})
                const responseData = {
                    name:currentUser.name,
                    cutType:currentUserBooking.cutType,
                    comingWith:currentUserBooking.comingWith,
                    userBookingID:userBookingID
                }
                responseArray.push(responseData)
            }
        }
        res.json({
            status: true,
            dailyQue : encryptData(responseArray),
            dayBookingID: encryptData(latestRecord.dayBookingID),
        })
    }
    
})

// Close daily booking and update daily cut counts
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

// Check the que token when page uploaded
publicRouter.post('/check-queue-token', async (req,res) => {
    const tokenBody = verificationQueToken(req.body.queueToken)
    if(tokenBody !== false){
        res.json({
            status: true,
            queueToken: req.body.queueToken,
            message: 'token is valid'
        })
    }else{
        res.json({
            status:false,
            message:'token is not valid'
        })
    }       
})

// Controlling queueToken for cancel the order and then cancel
publicRouter.post('/cancel-queue', async (req,res) => {
    const tokenBody = verificationQueToken(req.body.queueToken)
    console.log(tokenBody)
    if(tokenBody !== false){
        
        const userBooking = await UserBooking.findOne({userBookingID:tokenBody.userBookingID})
        const dayBooking = await DayBooking.findOne({dayBookingID:tokenBody.dayBookingID})
        console.log(dayBooking.usersBooking)
        if(req.body.queueToken === userBooking.bookingToken && dayBooking.usersBooking.indexOf(userBooking.userBookingID) > -1){
            dayBooking.usersBooking = dayBooking.usersBooking.filter( userBookingID => userBookingID !== userBooking.userBookingID)
            await dayBooking.save()
            res.json({
                status:true,
                userBookingID:userBooking.userBookingID
            })
        }else{
            res.json({
                status:false,
                message:'Token is not valid'
            })
        }
    }else{
        res.json({
            status:false,
            message:'Token is not valid'
        })
    }
})


//Create a admin access token and send to ui 
publicRouter.post('/admin-login', async (req,res) => {
    const admin = await Admin.findOne()
    if(admin.username === req.body.username && admin.password === req.body.password){
        const adminAccessToken = getTokenforAdmin()
        admin.adminAccessToken = adminAccessToken
        await admin.save()

        res.json({
            status:true,
            adminAccessToken
        })
    }else{
        res.json({
            status:false,
            message:'Invalid username or password.'
        })
    }

})

// getting message for announcment
publicRouter.get('/get-message', async (req,res) => {
    const shop = await Shop.findOne()
    const message = shop.showMessage
    res.json({
        message:message
    })
})
export default publicRouter