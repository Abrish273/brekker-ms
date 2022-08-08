const express = require('express')
const compression = require('compression');
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require("dotenv")
const helmet = require('helmet')
const middleware = require('./middleware/index');

const ideaRouter = require("./routes/ideaRoutes")

const app = express()
dotenv.config()
const mongoURL = process.env.MONGO_URL
const connectWithRetry = () =>{
    mongoose
    .connect(mongoURL)
    .then(()=> console.log("Successfully connected to DB"))
    .catch((e)=> {
        console.log(e)
        setTimeout(connectWithRetry, 5000)
    })
}
connectWithRetry()

app.enable("trust proxy");
app.use(cors({}))
app.use(express.json())
app.disable('x-powered-by')
app.use(helmet())
// Compress all HTTP responses
app.use(compression());
//Middleware
app.use(middleware.decodeToken);



app.use("/ideabrekrr", ideaRouter)

// custom 404
app.use((req, res, next) => {
  res.status(404).send("Route Not Found")
})

// custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Error in the Server, Something broke!')
})
module.exports = app;