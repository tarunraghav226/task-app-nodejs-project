const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
    try{
        const token = req.header("Authorization").replace("Bearer ", "")
        const decoded = jwt.verify(token, "xdfsdfoiwer")
        const user = await User.findOne({_id: decoded._id, "tokens.token": token})
        if(!user){
            throw new Error()
        }

        req.user = user
        next()
    } catch(error){
        res.status(400).send("Please authenticate.")
    }
}

module.exports = auth
