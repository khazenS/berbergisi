const { default: mongoose } = require("mongoose");

const smsVerificationSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 4, maxlength: 20 },
    phoneNumber: String,
    code: String,
    token: {type: String, unique: true},
    createdAt: { type: Date, default: Date.now  },
    count:{ type: Number, default: 0 }, // Count of verification attempts
})
// Create TTL index on createdAt field
smsVerificationSchema.index({ "createdAt": 1 }, { expireAfterSeconds: 120 }); // 2 minutes

const SMSVerification = mongoose.model('SMSVerification', smsVerificationSchema, 'SMSVerification');

module.exports = { SMSVerification };