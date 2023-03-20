const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        validate(value){
            if(value < 0){
                throw new Error("Age must be a positiv e number")
            }
        }
    },
    email: {
        required: true,
        type: String,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email")
            }
        }
    },
    password: {
        required: true,
        type: String,
        validate(value){
            if(value == "" || value.length < 8){
                throw new Error("Invalid password")
            }
        }
    }
})

userSchema.pre("save", async function(next){
    const user = this

    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

// const me = new User({
//     name: "Tarun",
//     age: 22,
//     email: "traun"
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log(error)
// })

module.exports = User