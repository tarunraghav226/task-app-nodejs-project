const mongoose = require("../db/mongoose")
const express = require("express")
const User = require("../models/User")
const auth = require("../middlewares/auth")
const { ObjectId } = require("mongodb")
const multer = require("multer")

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

const upload = multer({
    // dest: 'avatars', // if we dont give dest ket than we can access file buffer in route
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error("Please  upload a image file"))
        }
        return callback(undefined, true)
    }
})

userRoute.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res)=>{
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

userRoute.delete("/users/me/avatar", auth, async (req, res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

module.exports = userRoute
