const mongoose = require("../db/mongoose")
const express = require("express")
const User = require("../models/User")
const auth = require("../middlewares/auth")
const { ObjectId } = require("mongodb")

const userRoute = express.Router()

userRoute.post("/users", async (req, res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()
        return res.send({
            status: "success",
            data: {user, token}
        })
    }catch(e){
        return res
        .send({
            status: "failure",
            data: []
        })
    }
})

userRoute.get("/users/me", auth, async (req, res) =>{
    return res.send(req.user)
})

userRoute.get("/users/:id", auth, async (req, res) =>{
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

userRoute.patch("/users/me", auth, async (req, res) => {
    try{
        const updates = Object.keys(req.body)
        const allowedUpdateKeys = ["name", "email", "password", "age"]
        const isValidUpdate = updates.every((updateKey)=>allowedUpdateKeys.includes(updateKey))

        if(!isValidUpdate){
            return res.status(400).send({error: "Invalid update request"})
        }

        const user = req.user
        updates.forEach((updateKey)=>{
            user[updateKey] = req.body[updateKey]
        })
        await user.save()
        // const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        return res.status(200).send({
            status: "success",
            data: user
        })
    }catch(e){
        console.log(e)
        return res.status(400).send({
            status: "failure",
            message: e
        })
    }
})

userRoute.delete("/users/me", auth, async (req, res) => {
    try{
        await req.user.remove()
        return res.status(200).send({
            status: "success",
            message: "User deleted succesfully"
        })
    }catch(e){
        return res.status(400).send({
            status: "failure",
            message: e
        })
    }
})

userRoute.post("/users/login", async (req, res)=>{
    try{
        const user = await User.findUserByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        console.log(e)
        res.status(400).send()
    }
})

userRoute.post("/users/logout", auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    }catch(error){
        console.log(error)
        res.status(500).send()
    }
})

userRoute.post("/users/logout/all", auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()

        res.send()
    }catch(error){
        console.log(error)
        res.status(500).send()
    }
})

module.exports = userRoute
