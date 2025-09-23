const mongoose = require("mongoose")

const connectDB = async()=>{
    try{
        console.log("Trying to connect with database!");
        await mongoose.connect(process.env.CONNECTION_STRING)
        console.log("Database connected successfully!");
    }
    catch(err){
        console.error("error conneting database : " , err.message);
        process.exit(1);
    }
}
module.exports = connectDB