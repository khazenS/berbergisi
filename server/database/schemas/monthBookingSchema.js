import mongoose from "mongoose";
import mongooseSequence from 'mongoose-sequence'

const AutoIncrement = mongooseSequence(mongoose)

const monthBookingSchema = new mongoose.Schema({
    dayBooking : [
        {
            type:Number,
            default:[]
        }
    ],
    cutCount : {
        type:Number,
        default : 0
    },
    cutBCount : {
        type : Number,
        default : 0
    },
    monthlyPaid : {
        type:Number,
        default:0
    },
    existMonthDate : {
        type:Date
    }
})

monthBookingSchema.plugin(AutoIncrement,{inc_field: 'monthBookingID' })

export const MonthBooking = mongoose.model('MonthBooking',monthBookingSchema,'MonthBooking')