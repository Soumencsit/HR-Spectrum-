
require('dotenv').config()
const mongoose = require("mongoose");
const URI=process.env.MONGO_URI
const connectDB = async () => {
    await mongoose.connect(URI)
    .then(() => {
        console.log("Database Connection Successful");
    })
    .catch((err) => {
        console.error("Database Connection Error:", err);
    });
}

module.exports = connectDB;


