const User=require("../models/user.model.js")

async function removeUnverifiedUsers() {

    try {
  
      let page = 1;
      let pageSize = 5;  
   
      while (true) {
  
        const users = await User.find()
          .sort({ createdAt: 1 })  
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .select(" isVerified createdAt")
         
        if (users.length === 0) {
          break;  
        }
  
        for (const user of users) {
   
         let yesterday = new Date();
         yesterday.setDate(yesterday.getDate() - 1);

         await User.deleteOne({isVeried:false,createdAt:{$lt:yesterday}})
        }
  
        page++;
      }
    } catch (error) {
       
      console.error(error);
    }
  }

  // Here we are removing those unverified users who have registered their account and 24 hours also has gone 
  // but still they did not verified their account

  module.exports=removeUnverifiedUsers;