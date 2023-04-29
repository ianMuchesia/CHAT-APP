require('dotenv').config()
require('express-async-errors')


//express
const express = require('express')
const app = express()


//rest of the packages
const http = require('http')
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

//middleware
const notFoundMiddleWare = require('./middleware/not-found')
const errorHandlerMiddleWare = require('./middleware/error-handler')

const rooms = ['general', 'tech', 'finance', 'crypto']

app.set('trust proxy', 1);
/* app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
); */
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_SIDE_URL, credentials: true}));
app.use(xss());
app.use(mongoSanitize());

app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET));





//routes
app.use('/api/v1/auth', authRouter)


app.use(errorHandlerMiddleWare)
app.use(notFoundMiddleWare)

//io
const server = http.createServer(app);
const io = require('socket.io')(server,{
  cors:{
    origin: process.env.CLIENT_SIDE_URL,
    methods:['GET', 'POST']
  }
})


const port = process.env.PORT || 3000

//server
const start = async()=>{
    try {
        connectDB(process.env.MONGO_URI)
        server.listen(port,()=>{console.log(`server listening on port ${port}`)})
    } catch (error) {
        console.log(error)        
    }
}

start()