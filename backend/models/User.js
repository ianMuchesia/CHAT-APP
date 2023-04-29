const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
 name: {
      type: String,
      required: [true, "Name is required"],
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "please provie valid email",
      ],
      unique: true,
      index:true
    },
    password: {
      type: String,
      required: [true, "please provide password"],
      minlength: 6,
    },
    picture: {
      type: String,
    },
 newMessage:{
    type:Object,
    default:{}
 },
 status:{
    type:String,
    default:"online"
 }
   
  },
  { timestamps: true },{minimize:false}
);



//When the index property is set to true, it creates a single field index for the specified field. In this case, index:true creates an index for the email field, which can improve the performance of queries that search for documents based on the email address.


//The minimize option is set to false, which means that empty objects will be retained in the JSON representation of the document.

UserSchema.methods.toJSON= function(){
    const user  = this
    const userObject = user.toObject()
    delete userObject.password
    if (!userObject.newMessage) {
        userObject.newMessage = {};
    }
    return userObject
}

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
