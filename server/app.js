import express from 'express'
import dotenv from "dotenv"
import dbConnection from './database/dbConnection.js'
import { accessMiddleware } from './middleware/accessMiddleware.js'
import adminRouter from './routes/adminRoute/adminRoute.js'
import publicRouter from './routes/publicRoute/publicRoute.js'
import cors from 'cors'
import { createServer } from 'node:http';
import {Server} from 'socket.io'
import setupSocket from './helpers/socket.js'
import { cryptoMiddleware } from './middleware/cryptoMiddleware.js'

const app = express()
// CORS middleware
app.use(cors())
//Setup of socket
const server = createServer(app);
export const io = new Server(server,{
    cors: {
      origin: "http://localhost:3000", 
      methods: ["GET", "POST"]
    },
    transports: ['websocket']
  })
//Socket processes
setupSocket(io)

dotenv.config()
//Database Connection
dbConnection()

// JSON bady parsing middleware
app.use(express.json());
//Crypto Middleware
app.use(cryptoMiddleware)
// PUBLIC API
app.use("/api/public",publicRouter)

// Access Middleware
app.use(accessMiddleware)

// PRIVATE API
app.use("/api/admin",adminRouter)

server.listen(process.env.PORT, '0.0.0.0',() => {
  console.log('uygulama suanda ',process.env.PORT,' portunda calisiyor')
})