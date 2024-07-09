import express from 'express'
const publicRouter = express.Router()

publicRouter.get('/',(req,res)=>{
    res.send("this is public get req")
})

export default publicRouter