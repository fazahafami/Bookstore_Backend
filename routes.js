//import express
const express = require('express')
const userController = require('./controllers/userController')
const bookControlller = require('./controllers/bookController')
const jobControlller = require('./controllers/jobController')
const appController = require('./controllers/appController')
const jwtMiddleware = require('./middleware/jwtMiddleware')
//import multer config
const multerConfig = require('./middleware/imgMulterMiddleware')
//import pdf multer
const pdfMulterConfig = require('./middleware/pdfMutlerMiddleware')

//instance
const route = new express.Router()

//path for register
route.post('/register', userController.registerController)

//path for login
route.post('/login',userController.loginController)

//path for google-login
route.post('/google-login',userController.googleLoginController)

//PATH TO GET ALL HOME BOOK
route.get('/all-home-book',bookControlller.getHomeBookController)

//to get all jobs
route.get('/all-jobs',jobControlller.getAllJobsController)


///--------------------------------USER-------------------------------

//path for addBooks
route.post('/add-book', jwtMiddleware,multerConfig.array('uploadedImages',3),bookControlller.addBookControlller)

//get all books
route.get('/all-book',jwtMiddleware,bookControlller.getAllBooksController)

//get a single book
route.get('/view-book/:id',bookControlller.getABookController)

//to apply for a job
route.post('/apply-job',jwtMiddleware,pdfMulterConfig.single('resume'),appController.addApplicationController)

//to update user profile
route.put('/user-profile-update',jwtMiddleware,multerConfig.single('profile'),userController.editUserProfileController)

//to get all user added books
route.get('/user-books',jwtMiddleware,bookControlller.getAllUserBookController)

//to get all user brought books
route.get('/user-brought-books',jwtMiddleware,bookControlller.getAllUserBroughtBookController)

//to delete user book
route.delete('/delete-user-book/:id',bookControlller.deleteUserBookController)

//to make payment
route.put('/make-payment',jwtMiddleware,bookControlller.makePayementController)


//--------------------------------ADMIN-----------------------------------//

//to get all books for admin
route.get('/admin-books',jwtMiddleware , bookControlller.getAllBookAdminController)

//to approve a book
route.put('/approve-book',jwtMiddleware,bookControlller.approveBookController)

//to get all users
route.get('/all-users',jwtMiddleware,userController.getAllUsersController)

//to add new job
route.post('/add-job',jobControlller.addJobController)

//to delete a job
route.delete('/delete-job/:id',jobControlller.deleteAJobController)

//to get all applications
route.get('/all-applications',appController.getAllApplicationsController)

//to update admin profile
route.put('/admin-profile-update',jwtMiddleware,multerConfig.single('profile'),userController.editAdminProfileController)

//export routes
module.exports = route