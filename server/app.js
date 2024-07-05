import express from 'express'
import dotenv from "dotenv"
import dbConnection from './database/dbConnection.js'
import routes from './routes/routes.js'
import { accessMiddleware } from './middleware/accessMiddleware.js'

dotenv.config()
//Database Connection
dbConnection()
const app = express()

// JSON bady parsing middleware
app.use(express.json());
// Access Middleware
app.use(accessMiddleware)
app.use("/",routes)
app.get('/',(req,res) => {
    res.json({
        "message":"Hello World"
    })
})

app.listen(process.env.PORT,() => {
    console.log("uygulama Calisiyor.")
})