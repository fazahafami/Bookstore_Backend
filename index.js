//import dotenv
require('dotenv').config()//loads evv variables

// import express library
const express = require('express')
const cors = require('cors')
const route = require('./routes')
//import connection file
require('./databaseconnection')



// create server using express()
const bookstoreServer = express()


//use cors in server
bookstoreServer.use(cors())
bookstoreServer.use(express.json())//add middleware to parsejson data
bookstoreServer.use(route)//use routes file
bookstoreServer.use('/upload',express.static('./uploads'))//export the uploads folder from the server side
bookstoreServer.use('/pdfupload',express.static('./pdfUploads'))//to upload resume pdf

// create port
PORT = 4000 || process.env.PORT

// listen
bookstoreServer.listen(PORT , ()=>{
    console.log(`server running successfully at port number:  ${PORT}`);    
})