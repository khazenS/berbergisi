const express = require('express');
const dotenv = require('dotenv');
const dbConnection = require('./database/dbConnection.js');
const { accessMiddleware } = require('./middleware/accessMiddleware.js');
const adminRouter = require('./routes/adminRoute/adminRoute.js');
const publicRouter = require('./routes/publicRoute/publicRoute.js');
const cors = require('cors');
const { createServer } = require('http');
const { cryptoMiddleware } = require('./middleware/cryptoMiddleware.js');
const { initializeSocket } = require('./helpers/socketio.js');
const webpush = require('web-push');
// Load environment variables
dotenv.config();


// Express app setup
const app = express();

// Setup of socket
const server = createServer(app);

// Initilize the socket here
initializeSocket(server)

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

// Web Push Configs
webpush.setVapidDetails(
  'mailto:yourMail@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

// PUBLIC API
app.use("/api/public",publicRouter);

// PRIVATE API
app.use("/api/admin",accessMiddleware, adminRouter);

// Database Connection
dbConnection();

// Start the server
server.listen(process.env.PORT, '0.0.0.0', () => {
  console.log('The app is working on that port: ', process.env.PORT);
});
