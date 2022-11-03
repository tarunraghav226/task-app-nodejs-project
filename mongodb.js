const mongodb = require("mongodb")

const mongodbClient = mongodb.MongoClient

const connectionURL = "mongodb://127.0.0.1:27017"
const databaseName = "task-manager"

mongodbClient.connect(
    connectionURL,
    {
        useNewUrlParser: true
    },
    (error, client)=>{
        if(error){
            return console.log("unable to connect to datatbase")
        }
        const db = client.db(databaseName)
        db.collection("users").insertOne({
            name: "Tarun",
            age: 22
        })
    }
)
