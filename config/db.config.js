const AWS = require("aws-sdk")

AWS.config.update({
    region: "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const docClient = new AWS.DynamoDB.DocumentClient()

// const Table = `users-${process.env.envtype}`

module.exports= {
    docClient,
    // Table
}