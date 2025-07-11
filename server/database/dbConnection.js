const mongoose = require("mongoose");

const dbConnection = () => {
    mongoose.connect(process.env.DB_URL, {
        dbName:"yourDatabaseName", // Replace with your actual database name
    }).then(() => {
        console.log("Connected to DB successfully")
    }).catch((err) => {
        console.log("There is an error on DB!" + err)
    })
}

module.exports = dbConnection