const express = require('express');
const { getTokenforAdmin, getTokenforQue, verificationQueToken } = require('../../helpers/jwtProcesses.js');
const { Shop } = require('../../database/schemas/shopSchema.js');
const { User } = require('../../database/schemas/userSchema.js');
const { DayBooking } = require('../../database/schemas/dayBookingSchema.js');
const { encryptData } = require('../../helpers/cryptoProcess.js');
const { MonthBooking } = require('../../database/schemas/monthBookingSchema.js');
const { UserBooking } = require('../../database/schemas/userBookingSchema.js');
const { Admin } = require('../../database/schemas/adminSchema.js');

const publicRouter = express.Router()


//Learn the shop open or close
publicRouter.get('/getShopStatus',async (req,res)=>{
    const shop = await Shop.findOne({shopID:1})
    res.json({
        status:true,
        shopStatus: shop.shopStatus,
        orderFeature : shop.orderFeature
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
    const latestRecord = await DayBooking.findOne().sort({existDayDate : -1})
    
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
    if(tokenBody !== false){
        
        const userBooking = await UserBooking.findOne({userBookingID:tokenBody.userBookingID})
        const dayBooking = await DayBooking.findOne({dayBookingID:tokenBody.dayBookingID})
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
module.exports = publicRouter