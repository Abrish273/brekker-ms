const mongoose = require('mongoose')
const app = require('./index');
// const config = require('./config/config.js')
const port = process.env.PORT || 5000;

// DB Connection
// mongoose.connect(config.db_url, { useUnifiedTopology: true, useNewUrlParser: true }).then((a) => {
//     console.log('DB Connected...')
//     server_status = 'online'
// }).catch((e) => {
//     console.error(e)
//     server_status = 'offline'
// })


const mongoURL = process.env.MONGO_URL
const connectWithRetry = () =>{
mongoose
    .connect(mongoURL)
    .then(()=> {
        server_status = 'online'
        
        console.log("Successfully connected to DB")})
    .catch((e)=> {
        console.log(e)
        server_status = 'offline'
        setTimeout(connectWithRetry, 5000)
    })
}
connectWithRetry()

app.listen(port, () => console.log(`Listening on port ${port}`))