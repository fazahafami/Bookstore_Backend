const users = require("../model/userModel");
const jwt = require('jsonwebtoken')

//register
exports.registerController = async (req,res)=>{
    //logic
    const {username , email, password} = req.body
    console.log(username , email, password);
   
    try {
        const existingUser = await users.findOne({email})
        if(existingUser){
            res.status(409).json('Already user exits')
        }
        else{
            const newUser = new users({
                username,
                email,
                password

            })
            await newUser.save()//mongodbsave
            res.status(200).json(newUser)
        }
        
    } catch (error) {
        res.status(500).json(error)
    }
    

}

exports.loginController = async (req,res) =>{
    const {email,password} = req.body
    console.log(email,password);
    
    try {

        const existingUser = await users.findOne({email})
        if(existingUser){
            if(existingUser.password == password){
                const token = jwt.sign({userMail: existingUser.email},'secretkey')
                res.status(200).json({existingUser,token})
            }else{
              res.status(401).json('Incorrect email or password')  
            }

        }
        else{
            res.status(404).json('Account does not exist...')
        }
        
    } catch (error) {
         res.status(500).json(error)
    }
}

exports.googleLoginController = async (req,res) =>{
    const {username, email, password, profile } = req.body
    console.log(username, email, password, profile);

    try {

        const existingUser = await users.findOne({email})

        if(existingUser){
             const token = jwt.sign({userMail: existingUser.email},'secretkey')
                res.status(200).json({existingUser,token}) 
        }
        else{
              const newUser = new users({
                username,
                email,
                password,
                profile

            })
            await newUser.save()//mongodbsave
             const token = jwt.sign({userMail: newUser.email},'secretkey')
                res.status(200).json({newUser,token}) 
           
        }
        
    } catch (error) {
        res.status(500).json(error)
        
    }
    
}

//get all users
exports.getAllUsersController = async(req,res)=>{
    const email = req.payload
    console.log(email);
    
    try {
        const allUsers = await users.find({email:{$ne:email}})
        res.status(200).json(allUsers)
        
    } catch (error) {
        res.status(500).json(error)
    }
}

//edit admin profile
exports.editAdminProfileController = async(req,res)=>{
    const {username ,password ,profile} = req.body
    const prof = req.file? req.file.filename : profile
    const email= req.payload
    try {
        const adminDetails = await users.findOneAndUpdate({email},{username , email , password , profile:prof},{new:true})
        // await userDetails.save()
        res.status(200).json(adminDetails)
        
    } catch (error) {
        res.status(500).json(error)
    }
    
}

//edit user profile
exports.editUserProfileController = async(req,res)=>{
    const {username ,password, bio ,profile} = req.body
    const prof = req.file?req.file.filename: profile
    const email = req.payload
    try {
        const userDetails = await users.findOneAndUpdate({email},{username,email,password,bio,profile:prof},{new:true})
        res.status(200).json(userDetails)
    } catch (error) {
        res.status(500).json(error)
    }
}