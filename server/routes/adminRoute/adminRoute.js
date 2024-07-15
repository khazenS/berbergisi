import express from 'express'
import { Shop } from '../../database/schemas/shopSchema.js'
const adminRouter = express.Router()

adminRouter.post('/change-status',async(req,res)=>{
    const shop = await Shop.findOne({shopID:1})
    shop.shopStatus = !req.body.statusData
    await shop.save()
    res.json({
        status:true,
        message:"shopStatus was updated"
    })
})


export default adminRouter;

