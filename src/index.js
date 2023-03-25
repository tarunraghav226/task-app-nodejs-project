const express = require("express")
const userRoute = require("./routes/userRoutes")
const taskRoute = require("./routes/taskRoutes")

const app = express()

app.use(express.json())
app.use(taskRoute)
app.use(userRoute)

const port = process.env.PORT || 3000

app.listen(port, ()=>{
        console.log(`Server is up and running on port ${port}`)
    }
)
