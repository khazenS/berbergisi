const mongoose = require('mongoose');
const mongooseSequence = require('mongoose-sequence');

const AutoIncrement = mongooseSequence(mongoose)

const dayBookingSchema = new mongoose.Schema({
    usersBooking : [
        {
            type:Number,
            default: []
        }
    ],
    isClosed : {
        type : Boolean,
        default : false
    },
    dailyCount:{
        type:[{
            serviceID:Number,
            count:Number
        }],
        default:[]
    },
    dailyPaid : {
        type:Number,
        default:0
    },
    existDayDate : {
        type:Date
    }
})

dayBookingSchema.plugin(AutoIncrement,{inc_field: 'dayBookingID' })

const DayBooking = mongoose.model('DayBooking',dayBookingSchema,'DayBooking')

module.exports = {DayBooking};