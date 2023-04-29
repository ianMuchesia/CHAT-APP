const mongoose = require('mongoose')


const Schema = mongoose.Schema


const MessageSchema = new Schema ({
    Content: String,
    from:Object,
    socketId:String,
    time:String,
    date:String,
    to:String
})

const Message = mongoose.model("Message" , MessageSchema)

module.exports = Message