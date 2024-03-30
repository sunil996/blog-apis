const multer=require("multer");
const path=require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename:  function (req,file,cb ) {

        const uniqueFileName=`${file.originalname}-${Date.now()}${path.extname(file.originalname)}`
        cb(null,uniqueFileName)
      },

  })
  
  const upload = multer({ storage: storage,limits:{fileSize: 5 * 1024 * 1024} });

  module.exports=upload