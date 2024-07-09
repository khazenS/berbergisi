import mongoose from "mongoose"
import {adminSchema} from "../database/schemas/adminSchema.js"
import { verificationToken } from "../helpers/jwtProcesses.js"


// We check the ui and database token
export const accessMiddleware = async (req,res,next) => {
    const headerToken = req.headers['authorization'].split(" ")[1]

    const Admin = mongoose.model('Admin',adminSchema)
    const adminDoc = await Admin.find({})
    
    if(verificationToken(headerToken) && adminDoc[0].adminAccessToken == headerToken){
        next()
    }
    else{
        res.json({
            status:false,
            message:"Token is not valid or expired!"
        })
    }

    
}