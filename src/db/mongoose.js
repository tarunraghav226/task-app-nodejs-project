const mongoose = require("mongoose")

const connectionURL = "mongodb://127.0.0.1:27017"

mongoose.connect(connectionURL+"/task-manager-api", {
    useNewUrlParser: true
})
