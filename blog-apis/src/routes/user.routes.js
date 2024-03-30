const express=require("express");
const router=express.Router(); 
const upload = require("../middelewares/multer.middleware.js");
const fs=require("fs");
const verifyJWT=require("../middelewares/auth.middeleware.js");

const {registerUser,verifyUser,loginUser,logoutUser,resendOtp}=require("../controllers/user.controller.js")

const checkImageFileType = (req, res, next) => {

    if(req.file) {

    if( !req.file.mimetype.startsWith('image') ){

        fs.unlinkSync(req.file);
        return res.status(400).json({success:false, message: 'Uploaded file is not an image',data:null });

    };
     next();
    }else{
        return res.status(400).json({success:false, message: 'Please provide profile image.',data:null });
    }
}

router.route("/").post(upload.single("profileImage"),checkImageFileType,registerUser)
router.route("/verify/:userId").post(verifyUser)
router.route("/login").post(loginUser) 
router.route("/resendOtp").get(resendOtp);
router.route("/logout").post(verifyJWT,logoutUser);
 
module.exports=router;
        
