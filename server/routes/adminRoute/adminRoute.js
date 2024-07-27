import express from 'express'
import { Shop } from '../../database/schemas/shopSchema.js'
const adminRouter = express.Router()

// Changin status for shop opening or closing
adminRouter.post('/change-status',async(req,res)=>{
    const shop = await Shop.findOne({shopID:1})
    shop.shopStatus = !req.body.statusData
    await shop.save()
    res.json({
        status:true,
        newStatus:!req.body.statusData,
        message:"shopStatus was updated"
    })
})


adminRouter.get('/controlAdminAccessToken',async(req,res)=>{
    res.json({
        status:true,
        message:"Token is valid"
    })
})


export default adminRouter;

