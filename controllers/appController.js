const applications = require("../model/appModel");

//add application
exports.addApplicationController = async(req,res)=>{
    const {fullname,jobtitle,qualification,email,phone,coverletter} =req.body

    console.log(fullname,jobtitle,qualification,email,phone,coverletter);
    
    
    const resume = req.file.filename
    console.log(resume);
    
    try {
        const existingApplication = await applications.findOne({jobtitle, email})
        if(existingApplication){
            res.status(400).json('Alraedy applied')
        }
        else{
            const newApplicant = new applications({fullname,jobtitle,qualification,email,phone,coverletter,resume})
             await newApplicant.save()
             res.status(200).json(newApplicant)
        }  

    } catch (error) {
        res.status(500).json(error)
    }
}

//to get all applications
exports.getAllApplicationsController= async(req,res)=>{
    try {
         const allApplication = await applications.find()
         res.status(200).json(allApplication)
    } catch (error) {
        res.status(500).json(error)
    }
}