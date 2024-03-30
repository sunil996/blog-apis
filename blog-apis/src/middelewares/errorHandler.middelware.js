 
const errorHandler = (err, req, res, next) => {
 
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token has expired", data: null });
  }
 
   return res.status(statusCode).json({
     success:false,
    message:message, 
    data:null
  }); 
  };
  
  module.exports =errorHandler;