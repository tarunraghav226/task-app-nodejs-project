const express = require("express")
const { ObjectId } = require("mongodb")
require('./db/mongoose')

const User = require("./models/User")

const app = express()

app.use(express.json())

const port = process.env.PORT || 3000


app.post("/users", async (req, res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        return res.send({
            status: "success",
            data: user
        })
    }catch(e){
        return res
        .send({
            status: "failure",
            data: []
        })
    }
})

app.get("/users", async (req, res) =>{
    try{
        const users = User.find({})
        return res.send(users)
    }catch(e){
        return res.send({
            status: "failure",
            data: "fail"
        })
    }
})

app.get("/users/:id", async (req, res) =>{
    const _id = req.params.id
    try{
        const user = await User.findOne({_id})
        if(!user){
            return res.status(404).send({
                status: "failure",
                data: "User not found"
            })
        }
        return res.send(user)
    } catch (e){
        return res.send({
            status: "failure",
            data: null
        })
    }
})

app.patch("/users/:id", async (req, res) => {
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!updatedUser){
            return res.status(404).send({
                status: "failure",
                data: null
            })
        }

        return res.status(200).send({
            status: "success",
            data: updatedUser
        })
    }catch(e){
        return res.status(400).send({
            status: "failure",
            message: e
        })
    }
})

app.listen(port, ()=>{
        console.log(`Server is up and running on port ${port}`)
    }
)