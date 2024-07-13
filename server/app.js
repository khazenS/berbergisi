import express from 'express'
import dotenv from "dotenv"
import dbConnection from './database/dbConnection.js'
import { accessMiddleware } from './middleware/accessMiddleware.js'
import adminRouter from './routes/adminRoute/adminRoute.js'
import publicRouter from './routes/publicRoute/publicRoute.js'
import cors from 'cors'
const app = express()

dotenv.config()
//Database Connection
dbConnection()
// CORS middleware
app.use(cors())

// JSON bady parsing middleware
app.use(express.json());

// PUBLIC API
app.use("/api/public",publicRouter)

// Access Middleware
app.use(accessMiddleware)

// PRIVATE API
app.use("/api/admin",adminRouter)

app.get('/',(req,res) => {
    res.json({
        "message":"Hello World"
    })
})

app.listen(process.env.PORT,() => {
    console.log('uygulama suanda ',process.env.PORT,' portunda calisiyor')
})