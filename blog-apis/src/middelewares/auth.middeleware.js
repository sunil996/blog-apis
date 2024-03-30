const asyncHandler =require("../utils/asyncWrapper.js");
const  jwt =require("jsonwebtoken");
const User=require("../models/user.model.js")


const verifyJWT = asyncHandler(async (req,res, next) => {
 
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({success:false,message:"Unauthorized Request",data:null});
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password ")
   
    if (!user) {
      return res.status(401).json({success:false,message:"Invalid Access Token",data:null});
    }

    req.user = user;
    next();
});

module.exports = verifyJWT;
