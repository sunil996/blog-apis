const app =require("./app.js"); 
const connectDB=require("./db/connection.js");

connectDB()
.then(()=>{
 app.listen(process.env.PORT,()=>console.log(`server is listening on ${process.env.PORT}`));
  
})
.catch((error)=>{
    console.log("mongodb connection failed ",error);
}) 