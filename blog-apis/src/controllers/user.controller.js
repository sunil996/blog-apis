const asyncHandler=require("../utils/asyncWrapper.js");
const fs=require("fs");
const User = require('../models/user.model.js');
const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const transporter = require("../utils/mailer.js");
const mongoose = require('mongoose');
const uploadOnCloudinary=require('../utils/cloudinary.js');

const  registerUser = asyncHandler(async (req, res) => {
    
    const { userName,email,fullName,password  } = req.body;

    if (!userName?.trim() || userName?.trim().length < 3 || userName?.length > 50) {

        return res.status(400).json({ success: false, message: 'Username must be between 3 and 50 characters', data: null });
    }

    if (!email?.trim() || !emailRegex.test(email?.trim())) {

        return res.status(400).json({ success: false, message: 'Invalid email format', data: null });
    }

    if (!fullName?.trim() || fullName?.trim().length < 3 || fullName?.length > 50) {

        return res.status(400).json({ success: false, message: "Full name must be between 3 and 50 characters", data: null });
    } 

    if (!password || password.length < 6 || password.length > 150) {

        return res.status(400).json({ success: false, message: 'Password must be between 6 and 150 characters', data: null });
    }

    const existingUser = await User.findOne({$or:[{userName:userName.trim()},{email:email.trim()}]});

    if (existingUser) {
        fs.unlinkSync(req.file.path)
        return res.status(400).json({ success: false, message: 'User with the same username or email already exists', data: null });
    }

    const profileImage = await uploadOnCloudinary(req.file?.path,"profileImages");
    
    if (!profileImage) {
        return res.status(400).json({success:false,message:"Failed to upload profile image",data: null});
    }

    const newUser = await User.create({ userName:userName?.trim(), email:email?.trim(), fullName:fullName?.trim(), profileImage:profileImage.url, password:password?.trim() });
 
    const otpValue =await  newUser.generateOTP();
 
     const mailOptions = {
        from: process.env.MAIL_USER,
        to:newUser.email,
        subject: 'verification code for account registration',
        text: `Please use the following verification code to complete your registration process:\n Verification Code: ${otpValue}`,
      };

      await transporter.sendMail(mailOptions);
 
    return res.status(201).json({ success: true, message: 'User registered successfully', data: {userId: newUser._id} });
        
});

 
 const verifyUser = asyncHandler(async (req, res) => {
    
    const { userId } = req.params;
    const {otp}=req.body;
    
    if (!userId?.trim() || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({success: false, message: 'Please provide valid user id",data:null'})
    }

    const user = await User.findById(userId?.trim());

    if (!user) {
        return res.status(404).json({success:false,message:'User not found' ,data:null});
    }
   
    const isOTPVerified = await user.verifyOTP(otp);
  
    if (!isOTPVerified) {

        return res.status(401).json({
            success: false,
            message: 'Invalid OtP or exceeded attempts. Please check your OTP and try again. If the issue persists consider requesting a new Otp..',
            data: null
        });
    }
   
    user.isVerified = true;
    const updatedUser=await user.save({new:true});

    const accessToken=await user.generateAccessToken();

    const options = {
        httpOnly: true,
        secure: true
    }
    
    return res.status(200).cookie("accessToken",accessToken,options).json({ success:true,message: 'User verified successfully',data:{accessToken:accessToken,user:updatedUser } });
})

const  resendOtp = asyncHandler(async (req, res) => {
    
    const {userId}=req.params;

    if (!userId?.trim() || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({success: false, message: 'Please provide valid user id",data:null'})
    }

    const existingUser = await User.findById(userId?.trim());
  
    const otpValue =await  existingUser.generateOTP();
    
    const mailOptions = {
        from: process.env.MAIL_USER,
        to:newUser.email,
        subject: 'verification code for account registration for blog app.',
        text: `Please use the following verification code to complete your registration process:\n Verification Code: ${otpValue}`,
      };

     await transporter.sendMail(mailOptions);

   return  res.status(201).json({ message: 'otp resended again  to your Gmail Account Successfully', data:null });

})

const loginUser=asyncHandler(async(req,res)=>{
    
    const {email,password} = req.body;
   
    if (!email?.trim() || !emailRegex.test(email?.trim())) {
        return res.status(400).json({ success: false, message: 'Invalid email address format', data: null });
    }
 
    if (!password || password.length < 6 || password.length > 150) {
        return res.status(400).json({ success: false, message: 'Password must be between 6 and 150 characters', data: null });
    }

   const user = await User.findOne({email:email?.trim() })

    if (!user) { 
        return res.status(404).json({success:false,message:"User not found !",data:null})
    }
  
    const isPasswordValid = await user.isPasswordCorrect(password?.trim());
  
    if (!isPasswordValid) {
        return res.status(401).json({success:false,message:"Invalid user credentials !",data:null})
    }

   const accessToken=await user.generateAccessToken();

   const userData = {

    _id: user._id,
    userName: user.userName,
    email: user.email,
    fullName: user.fullName,
    profileImage: user.profileImage,
    isVerified: user.isVerified,
    
};
 
  const options = {
    httpOnly: true,
    secure: true
}
   return res.status(201).cookie("accessToken",accessToken,options).json({success:true,message:"successfull login",data:{accessToken:accessToken,user:userData}})
})

const logoutUser =async(req, res) => {

    const options = {
        httpOnly: true,
        secure: true
    }
  
    return res.status(201).clearCookie("accessToken",options).json({success:true,message:"successfully user has logged out. ",data:null})
 };


module.exports ={registerUser,verifyUser,loginUser,resendOtp,logoutUser}