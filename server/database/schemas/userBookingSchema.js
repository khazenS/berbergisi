import mongoose from 'mongoose'
import mongooseSequence from 'mongoose-sequence'

const AutoIncrement = mongooseSequence(mongoose)

const userBookingSchema = new mongoose.Schema({
    userID:{
        type:Number
    },
    name: {
        type:String,
        default:''
    },
    cutType:{
        type:String
    },
    comingWith:{
        type:Number
    },
    bookingToken:{
        type:String
    },
    registerTime:{
        type:Date
    }
})

userBookingSchema.plugin(AutoIncrement,{inc_field: 'userBookingID'})

export const UserBooking = mongoose.model('UserBooking',userBookingSchema,'UserBooking')