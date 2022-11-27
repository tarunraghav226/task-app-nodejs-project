const mongoose = require("mongoose")
const validator = require("validator")

const connectionURL = "mongodb://127.0.0.1:27017"

mongoose.connect(connectionURL+"/task-manager-api", {
    useNewUrlParser: true
})

const User = mongoose.model('User', {
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
    }
})

const me = new User({
    name: "Tarun",
    age: 22,
    email: "traun"
})

me.save().then(()=>{
    console.log(me)
}).catch((error)=>{
    console.log(error)
})
