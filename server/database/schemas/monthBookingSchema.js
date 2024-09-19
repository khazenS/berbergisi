const mongoose = require("mongoose");
const mongooseSequence = require('mongoose-sequence')

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

const MonthBooking = mongoose.model('MonthBooking',monthBookingSchema,'MonthBooking');

module.exports = {MonthBooking};