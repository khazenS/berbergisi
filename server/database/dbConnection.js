import mongoose from "mongoose";

const dbConnection = () => {
    mongoose.connect(process.env.DB_URL, {
        dbName:"barberDatabase",
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Connected to DB successfully")
    }).catch((err) => {
        console.log("There is an error on DB!" + err)
    })
}

export default dbConnection