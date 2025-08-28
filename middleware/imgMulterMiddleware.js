//import multer
const multer = require('multer')

//create disk storage
const storage = multer.diskStorage({
    //path to store the file
    destination:(req, file, callback)=>{
        callback(null,'./uploads')
    },
    //name to store the file
    filename:(req, file,callback)=>{
        const fname = `image-${file.originalname}`
        callback(null,fname)
    }
    
})

//filefilter
const fileFilter = (req, file ,callback)=>{
    if(file.mimetype ==='image/png' || file.mimetype ==='image/jpeg' || file.mimetype ==='image/jpg'){
        callback(null,true)
    }
    else{
        callback(null,false)
        return callback(new Error('accept only png, jpg, jpeg files'))
    }
}

//config multer
const multerConfig = multer({
    storage,
    fileFilter
})

module.exports = multerConfig