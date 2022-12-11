const express = require("express")
const { ObjectId } = require("mongodb")
require('./db/mongoose')

const User = require("./models/User")

const app = express()

app.use(express.json())

const port = process.env.PORT || 3000


app.post("/users", (req, res)=>{
    const user = new User(req.body)
    user.save().then(()=>{
        return res.send({
            status: "success",
            data: user
        })
    }).catch(()=>{
        return res
        .send({
            status: "failure",
            data: []
        })
    })
})

app.get("/users", (req, res) =>{
    User.find({})
            .then((users) => {
                return res.send(users)
            })
            .catch((err)=>{
                return res.send({
                    status: "failure",
                    data: "fail"
                })
            })
})

app.get("/users/:id", (req, res) =>{
    const _id = req.params.id
    User.findOne({_id})
    .then((user) => {
        if(!user){
            return res.status(404).send({
                status: "failure",
                data: "User not found"
            })
        }
        return res.send(user)
    })
    .catch((err)=>{
        console.log(err)
        return res.send({
            status: "failure",
            data: null
        })
    })
})

app.listen(port, ()=>{
        console.log(`Server is up and running on port ${port}`)
    }
)