import express from 'express'
const adminRouter = express.Router()

adminRouter.post('change-status',(req,res)=>{
    console.log(req.body)
    res.send("oldu")
})


export default adminRouter;

