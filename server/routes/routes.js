import express from "express"
const router = express.Router()

router.get("/users", (req,res) => {
    res.send("users Router")
})

router.post("/usersPost",(req,res) => {
    res.send("post req yapildi")
})

export default router