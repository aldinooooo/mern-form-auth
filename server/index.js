const express = require ('express')
const dotenv =require ('dotenv').config()
const cors = require ('cors')
const {mongoose} = require('mongoose')
const cookieParser = require('cookie-parser')
const app = express()

//connect to database
mongoose.connect(process.env.MONGO_URL)
.then(console.log('database connected'))
.catch((err)=>console.error(`database not connected`,err))

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))


//ROUTES

//get all data
app.use('/',require('./routes/authRoutes'))



const port = 8000
app.listen(port,console.log(`the server running on port ${port}`))