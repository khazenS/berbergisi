const mongoose = require('mongoose');

const smsLimiterSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '2d' // Document will be removed after 2 days
    },
    counter:{
        type: Number,
        default: 0
    },
    fp_key:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    phoneNumbers:{
        type: [String],
        default: []
    },
    ip:{
        current_ip : {
            type: String,
            required: true,
            trim: true
        },
        last_ip: {
            type: String,
            trim: true
        }
    }
})


const RequestLimiterSMS = mongoose.model('RequestLimiterSMS', smsLimiterSchema, 'RequestLimiterSMS');

module.exports = { RequestLimiterSMS };