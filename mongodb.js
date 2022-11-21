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

        db.collection("users")
            .findOne({
                _id: new mongodb.ObjectId("636404d998c80a0620871bdc")
            }, (error, user)=>{
                if(error){
                    console.log("Not able to fetch user")
                    return
                }
                console.log("Your result -->")
                console.log(user)
            })

        const updatePromise = db.collection("users")
                .updateOne(
                    {
                        _id: new mongodb.ObjectId("636404d998c80a0620871bdc")
                    },
                    {
                        $set: {
                            name: "tarun_updated"
                        }
                    }
                )
        updatePromise.then((response)=>{
            console.log(response)
        }).catch((err)=>{
            console.log(err)
        })
    }
)
