import mongoose from 'mongoose'
import mongooseSequence from 'mongoose-sequence'

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
    cutCount : {
        type:Number,
        default : 0
    },
    cutBCount : {
        type : Number,
        default : 0
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

export const DayBooking = mongoose.model('DayBooking',dayBookingSchema,'DayBooking')