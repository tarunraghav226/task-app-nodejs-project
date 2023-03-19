const mongoose = require("mongoose")

const password = encodeURIComponent("47vQ018AxJo2PABH")
const connectionURL = `mongodb+srv://tarunraghav226:${password}@cluster0.cpjyn.mongodb.net/task-manager-api?retryWrites=true&w=majority`

mongoose.connect(connectionURL, {
    useNewUrlParser: true
})
