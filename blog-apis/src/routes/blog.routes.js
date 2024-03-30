const express = require('express');
const router = express.Router();
const verifyJWT=require("../middelewares/auth.middeleware.js");
const {createBlog,getblogByCategory}=require("../controllers/blog.controller.js")


router.route("/create").post(verifyJWT,createBlog);
router.route("/:category").get(getblogByCategory);  //don't need of  adding jwt  middeleware here.


module.exports = router;