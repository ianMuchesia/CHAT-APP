const { BadRequestError } = require("../errors")

const getAuth = async(req, res)=>{
    const {name} = req.body
    if(!name){
        throw new BadRequestError("here i am")
    }
    res.send("hello world")
}




module.exports = {getAuth}