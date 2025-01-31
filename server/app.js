const express = require('express');
const dotenv = require('dotenv');
const dbConnection = require('./database/dbConnection.js');
const { accessMiddleware } = require('./middleware/accessMiddleware.js');
const adminRouter = require('./routes/adminRoute/adminRoute.js');
const publicRouter = require('./routes/publicRoute/publicRoute.js');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { cryptoMiddleware } = require('./middleware/cryptoMiddleware.js');
const { default: rateLimit } = require('express-rate-limit');

// Load environment variables
dotenv.config();


// Express app setup
const app = express();

// Setup of socket
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  },
  transports: ['websocket'] 
});

// passing io to router for use
app.use((req, res, next) => {
  req.io = io;  
  next();
});

// Basic route
app.get('/helloworld', (req, res) => {
  res.send('<h1 style="text-align:center; margin-top:1em;">Hello World</h1>');
});

// CORS middleware
app.use(cors());

// JSON body parsing middleware
app.use(express.json());

// Crypto Middleware
app.use(cryptoMiddleware);

// PUBLIC API
app.use("/api/public", publicRouter);

// PRIVATE API
app.use("/api/admin",accessMiddleware, adminRouter);

// Database Connection
dbConnection();

// Start the server
server.listen(process.env.PORT, '0.0.0.0', () => {
  console.log('Uygulama şu anda ', process.env.PORT, ' portunda çalisiyor');
});
