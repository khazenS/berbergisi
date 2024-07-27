import mongoose from 'mongoose'
import mongooseSequence from 'mongoose-sequence'

const AutoIncrement = mongooseSequence(mongoose)


const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    phoneNumber:{
        type:Number,
        unique:true
    },
    cutCount:{
        type:Number,
        default:0
    },
    cutBCount:{
        type:Number,
        default:0
    },
    paid:{
        type:Number,
        default:0
    },
    existTime:{
        type:Date
    }    
})

userSchema.plugin(AutoIncrement,{ inc_field: 'userId' })

export const User = mongoose.model('User',userSchema,'Users')