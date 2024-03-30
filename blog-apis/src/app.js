const express=require("express")
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const removeUnverifiedUsers=require("./utils/removeUnverifiedUsers.js")
const errorHandler=require("./middelewares/errorHandler.middelware.js") 
const userRouter=require("./routes/user.routes.js")
const blogRouter=require("./routes/blog.routes.js")

const app=express();

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
 

app.use("/api/v1/user",userRouter)
app.use("/api/v1/blog",blogRouter);

cron.schedule('0 0 * * 1-5', async () => {
    
    try {  
       await removeUnverifiedUsers();
    } catch (error) {
        console.error('Error in cleanup job:', error.message);
    }
  });

app.use(errorHandler); 

module.exports=app;
 
 