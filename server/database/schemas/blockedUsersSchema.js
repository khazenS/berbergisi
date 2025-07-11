const mongoose = require('mongoose');

const blockedUsersSchema = new mongoose.Schema({
    IP:{
        type: String,
        required: true,
    },
    fp_key:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    reason :{
        type: String,
        required: true
    },
    phoneNumber:{
        type: String,
        required: true,
        trim: true
    }
})

const BlockedUsers = mongoose.model('BlockedUsers', blockedUsersSchema, 'BlockedUsers');

module.exports = { BlockedUsers };