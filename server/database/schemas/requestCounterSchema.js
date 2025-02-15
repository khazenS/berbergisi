const { default: mongoose } = require("mongoose");

const requestCounterSchema = new mongoose.Schema({
    userKey:{
        type:String,
        unique:true,
        required:true
    },
    requestCount:{
        registerRequest:{
            type:Number,
            default:0
        },
        totalRequest:{
            type:Number,
            default:0
        }
    },
    existDate:{
        type:Date,
        default: () => new Date(Date.now() + 3 * 60 * 60 * 1000)
    }
})


const RequestCounter = mongoose.model("RequestCounter",requestCounterSchema)

module.exports = {RequestCounter}