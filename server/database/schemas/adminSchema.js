import mongoose from 'mongoose';
const { Schema } = mongoose;

export const adminSchema = new Schema({
    username:String,
    password:String,
    adminAccessToken:String
})

