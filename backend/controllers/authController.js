const { StatusCodes } = require("http-status-codes")
const { BadRequestError, NotFoundError, UnauthenticatedError } = require("../errors")
const User = require("../models/User")

const getAuth = async(req, res)=>{
    const {name} = req.body
    if(!name){
        throw new BadRequestError("here i am")
    }
    res.send("hello world")
}



const register  = async(req, res)=>{
    const {name , email , password } = req.body


    if(!name || !password || !email){
        throw new BadRequestError("provide all values")
    }

    const emailExists = await User.findOne({email})

    if(emailExists){
        throw new BadRequestError("email exists")
    }

    const user = await User.create({name , email , password})

    res.status(StatusCodes.CREATED).json({user, success:true})


}

const login = async(req, res)=>{
    const {email ,password} = req.body

    if(!email ||!password){
        throw new BadRequestError("provide all values")
    }

    const user = await User.findOne({email})

    if(!user){
        throw new NotFoundError("email not found")
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect){
        throw new UnauthenticatedError("wrong password")
    }
    user.status = 'online'


    await user.save()

    res.status(StatusCodes.CREATED).json({ success: true, user});
}


module.exports = {getAuth, register, login}