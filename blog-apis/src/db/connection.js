 require('dotenv').config(); 
const mongoose = require('mongoose');
const { DB_NAME } = require("../constant.js");

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        
       //console.log(connectionInstance.connections[0].name)
         console.log("connected to the "+connectionInstance.connections[0].name +" database.");
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }  
}

module.exports = connectDB;