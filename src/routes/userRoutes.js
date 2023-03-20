const mongoose = require("../db/mongoose")
const express = require("express")
const User = require("../models/User")
const { ObjectId } = require("mongodb")

const userRoute = express.Router()

userRoute.post("/users", async (req, res)=>{
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

userRoute.get("/users", async (req, res) =>{
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

userRoute.get("/users/:id", async (req, res) =>{
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

userRoute.patch("/users/:id", async (req, res) => {
    try{
        const updates = Object.keys(req.body)
        const allowedUpdateKeys = ["name", "email", "password", "age"]
        const isValidUpdate = updates.every((updateKey)=>allowedUpdateKeys.includes(updateKey))

        if(!isValidUpdate){
            return res.status(400).send({error: "Invalid update request"})
        }

        const user = await User.findById(req.params.id)
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

userRoute.delete("/users/:id", async (req, res) => {
    try{
        const deletedUser = await User.findByIdAndDelete(req.params.id)
        if(!deletedUser){
            return res.status(404).send({
                status: "failure",
                data: null
            })
        }
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

module.exports = userRoute
