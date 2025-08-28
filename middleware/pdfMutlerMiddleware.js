//import multer
const multer = require('multer')

//create disk storage
const storage = multer.diskStorage({
    //path to store the file
    destination:(req, file, callback)=>{
        callback(null,'./pdfUploads')
    },
    //name to store the file
    filename:(req, file,callback)=>{
        const fname = `resume-${file.originalname}`
        callback(null,fname)
    }
    
})

//filefilter
const fileFilter = (req, file ,callback)=>{
    if(file.mimetype ==='application/pdf'){
        callback(null,true)
    }
    else{
        callback(null,false)
        return callback(new Error('accept only pdf files'))
    }
}

//config multer
const pdfMulterConfig = multer({
    storage,
    fileFilter
})

module.exports = pdfMulterConfig