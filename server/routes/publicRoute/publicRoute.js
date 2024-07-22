import express from 'express'
import { getTokenforAdmin } from '../../helpers/jwtProcesses.js'
import { Shop } from '../../database/schemas/shopSchema.js';
const publicRouter = express.Router()

//Create a admin access token and send to ui 
publicRouter.get('/adminLogin',(req,res)=>{
    const adminAccessToken = getTokenforAdmin()
    res.json({
        status:true,
        adminAccessToken:adminAccessToken
    })
})
//Learn the shop open or close
publicRouter.get('/shopStatus',async (req,res)=>{
    const shop = await Shop.findOne({shopID:1})
    if(!shop){
        await new Shop({
            shopStatus:false,
            cutPrice:200,
            cutBPrice:250,
            showMessage:""
        }).save()
        res.json({
            status:true,
            shopStatus:false
        })
    }else{
        res.json({
            status:true,
            shopStatus: shop.shopStatus
        })
    }

})

// User register 
publicRouter.post('register-user', (req,res) => {
    console.log(req.body)
    
})
export default publicRouter