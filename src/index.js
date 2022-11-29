const express = require("express")
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
        return res.send({
            status: "failure",
            data: "fail"
        })
    })
})

app.listen(port, ()=>{
        console.log(`Server is up and running on port ${port}`)
    }
)