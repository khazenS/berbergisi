import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    username:String,
    password:String,
    adminAccessToken:String
})

export const Admin = mongoose.model('Admin',adminSchema,'admin')