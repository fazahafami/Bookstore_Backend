const jobs = require('../model/jobModel')
//add job
exports.addJobController = async(req,res)=>{
    const {title, location, jtype , salary , qualification , experience , description } = req.body

    console.log(title, location, jtype , salary , qualification , experience , description );
    
    try {
        const existingJob = await jobs.findOne({title, location})
        if(existingJob){
            res.status(401).json('Job already added.')
        }
        else{
            const newJob = new jobs({
                title, location, jtype , salary , qualification , experience , description
            })
            await newJob.save()
            res.status(200).json(newJob)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

//to get all jobs
exports.getAllJobsController = async(req,res)=>{
    const searchKey = req.query.search
    console.log(searchKey);
    
    try {
        const allJobs = await jobs.find({title:{$regex:searchKey,$options:"i"}})
        res.status(200).json(allJobs)
    } catch (error) {
        res.status(500).json(error)
    }
}

//delete a job
exports.deleteAJobController = async(req,res)=>{
    const {id}  = req.params
    try {
        await jobs.findByIdAndDelete({_id:id})
        res.status(200).json('Delete Successfull')
    } catch (error) {
       res.status(500).json(error) 
    }
}