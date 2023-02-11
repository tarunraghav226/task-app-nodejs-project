const express = require("express")
const userRoute = require("./routes/userRoutes")

const app = express()
app.use(userRoute)

app.use(express.json())

const port = process.env.PORT || 3000

app.listen(port, ()=>{
        console.log(`Server is up and running on port ${port}`)
    }
)
