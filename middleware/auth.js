const CognitoExpress = require('cognito-express')
const dotenv = require('dotenv');

dotenv.config();
// Setup CognitoExpress
const cognitoExpress = new CognitoExpress({
  region: process.env.COGNITO_DEFAULT_REGION,
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "access",
  tokenExpiration: 3600
})

exports.validateAuth = (req, res, next) => {
  // Check that the request contains a token
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    // Validate the token
    const token = req.headers.authorization.split(" ")[1]
    cognitoExpress.validate(token, function (err, response) {
      if (err) {
        // If there was an error, return a 401 Unauthorized along with the error
        res.status(401).send(err)
      } else {
        //Else API has been authenticated. Proceed.
        //todo: storing user id in requests from middleware
        // console.log(response)     

        req.user = {}
        req.user.user_id = response.sub
        req.user.username = response.username
        // req.user.signInProvider =  response.scope
        req.user.name =  response.name
        req.user.email =  response.email
        req.user.phone =  response.phone
        next();
      }
    });
  } else {
    // If there is no token, respond appropriately 
    res.status(401).send("No token provided.")
  }
}