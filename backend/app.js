require("dotenv").config();
require("express-async-errors");


const express = require('express');
const mongoose = require('mongoose');


const socketio = require('socket.io');

const app = express();
const server = require('http').Server(app);
const io = socketio(server, { cors: { origin: '*' } })

//rest of the packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');



//database
const connectDB = require('./database/connectDB')

//routers
const authRouter = require('./routes/authRoutes')
const messagesRouter = require('./routes/messagesRoutes.js');


// Middleware
const notFoundMiddleWare = require('./middleware/not-found')
const errorHandlerMiddleWare = require('./middleware/error-handler')

app.set('trust proxy', 1);
/* app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
); */
app.use(helmet());
app.use(cors( /* origin: process.env.CLIENT_SIDE_URLs, credentials: true} */));
app.use(xss());
app.use(mongoSanitize());





app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET));




//routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/messages', messagesRouter);

app.use(errorHandlerMiddleWare)
app.use(notFoundMiddleWare)


// Socket.IO
io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});




const port = process.env.PORT || 3000;

//server
const start = async () => {
  try {
    connectDB(process.env.MONGO_URI);
    server.listen(port, () => {
      console.log(`server listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();


