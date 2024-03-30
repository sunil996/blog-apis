const Blog=require("../models/blog.model.js")
const asyncHandler=require("../utils/asyncWrapper.js");
 

const createBlog = asyncHandler(async(req, res) => {

    let { title, description, category, tags } = req.body;

    if (!title?.trim() || title?.trim().length < 10 || title?.trim().length > 100 ) {

        return res.status(400).json({ success: false, message: 'Title must be between 10 and 100 characters long' ,data:null});
    }

    if(!description?.trim() || description?.trim().length < 10 || description?.trim() >1000){
      
        return res.status(400).json({ success: false, message: 'Description must be between 10 and 1000 characters long' ,data:null});
    }

    if(!category?.trim()){
       
        return res.status(400).json({ success: false, message: 'Category is required' ,data:null});
    }

    if( !tags || tags.length === 0){
        tags = [];
    }else{
        tags = tags.map(tag => tag.trim());
    }
    
    const blog=await Blog.create({

        title:title.trim(),
        description:description.trim(),
        category:category.trim(),
        tags:tags,
        author:req.user._id
    })
     
   return res.status(201).json({ success: true, message: " Blog created successfully ", data: blog });
    
 });

 const getblogByCategory = asyncHandler(async (req, res) =>{


    const category = req.params.category;
    const page = parseInt(req.query.page) || 1;   

    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!category?.trim()) {
        return res.status(400).json({ success: false, message: " Category is required " ,data:null});
    }

   // const blogs = await Blog.find({ category:category.trim() }).skip(skip) .limit(limit).populate("author").select("-fullName"); ;

   const blogs = await Blog.aggregate([

    { $match: { category: category.trim() } },
    { $skip: skip },
    { $limit: limit },

    {
        $lookup: {
            from: "users",  
            localField: "author",
            foreignField: "_id",
            as: "author"
        }
    },
    {    
         $unwind:"$author"
     },
     
    {
        $project: {
            
            "author.password": 0,  
            "author.otp": 0  
        }
    }
]);

    return res.status(200).json({ success: true, message: " Blogs retrieved successfully ", data: blogs });
 })

    module.exports = {
        createBlog,
        getblogByCategory
    }

