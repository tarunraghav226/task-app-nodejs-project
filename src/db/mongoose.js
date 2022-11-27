const mongoose = require("mongoose")

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
    }
})

const me = new User({
    name: "Tarun",
    age: -22
})

me.save().then(()=>{
    console.log(me)
}).catch((error)=>{
    console.log(error)
})
