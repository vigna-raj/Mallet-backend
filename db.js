const mongoose = require('mongoose');
const env = require("dotenv").config()
const uri = "mongodb+srv://vignaraj:" + process.env.DB_PASS + "@cluster0.joezcsp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const connectToDb = async () => {
    await mongoose.connect(uri);
    console.log("MongoDb connected sucessfully");
}
module.exports = connectToDb;