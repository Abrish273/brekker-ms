const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require("dotenv")
const middleware = require('./middleware/index');

const ideaRouter = require("./routes/ideaRoutes")

const app = express()
dotenv.config()
// const mongoURL = process.env.MONGO_URL
// const connectWithRetry = () =>{
//     mongoose
//     .connect(mongoURL)
//     .then(()=> console.log("Successfully connected to DB"))
//     .catch((e)=> {
//         console.log(e)
//         setTimeout(connectWithRetry, 5000)
//     })
// }
// connectWithRetry()

app.enable("trust proxy");
app.use(cors({}))
app.use(express.json())
//Middleware
app.use(middleware.decodeToken);



app.use("/ideabrekrr", ideaRouter)


module.exports = app;