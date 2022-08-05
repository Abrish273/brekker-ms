const IdeaData = require('../models/ideaDataModel')
const IdeaBlocked = require('../models/ideaBlockModel')
const axios = require('axios').default;

exports.getIdeaProfile = async (req,res,next)=>{
    try {
        var user_id;
        // console.log(req.query.user_id)
        if(req.query.user_id != null){
            user_id=req.query.user_id;
            const user = await IdeaData.findOne({_id:user_id});
            res.status(200).json({
                status:"success",
                user
            })
        }else{
            user_id = req.user.user_id;
            // console.log(user_id)
            const user = await IdeaData.findOne({_id:user_id});
            res.status(200).json({
                status:"success",
                user
            })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({
            status:"fail",
            msg:"Internal Server Error"
        })
    }
}

exports.registerIdeaProfile = async (req,res,next)=>{
    try {
        var user = await IdeaData.findOne({_id: req.body.user_id});
        if(user === null){
            user = await IdeaData.create(req.body);
            const uid = req.body.user_id + "idea";
            //create user for chats
          
            const options = {
                method: 'POST',
                url: 'https://214977e994c46638.api-us.cometchat.io/v3/users',
                headers: {
                    apiKey: process.env.cometchat_api_key,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                data: {
                    // metadata: {'@private': {email: 'user@email.com', contactNumber: '0123456789'}},
                    uid: uid,
                    name: req.body.name,
                    avatar: req.body.images[0].image_URL,
                    withAuthToken: false,
                }
                };

                axios
                .request(options)
                .then(function (response) {
                    console.log(response.data);
                })
                .catch(function (error) {
                    console.error(error);
                });
                    
            res.status(200).json({
                status:"success",
                user
            })
        }else{
            res.status(200).json({
                status:"success",
                user,
                message:"User Already Exists"
            })
        }

     
    } catch (e) {
        console.log(e)
        res.status(500).json({
            status:"fail",
            msg:"Internal Server Error"
        })
    }
}
exports.updateIdeaProfile = async (req,res,next)=>{
    try {
        const user = await IdeaData.findOneAndUpdate({_id:req.user.user_id}, req.body,{
            new:true,
            runValidators:true
        });
        const uid = req.user.user_id + "idea";

        //finish this
        if(req.body.name && req.body.images &&  req.body.images[0].image_URL){
            const options = {
                method: 'PUT',
                url: `https://214977e994c46638.api-us.cometchat.io/v3/users/${uid}`,
                headers: {
                    apiKey: process.env.cometchat_api_key,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                data: {
                    name: req.body.name,
                    avatar: req.body.images[0].image_URL
                }
                };

                axios
                .request(options)
                .then(function (response) {
                    console.log(response.data);
                })
                .catch(function (error) {
                    console.error(error);
                });
        }
        
        res.status(200).json({
            status:"success",
            user
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            status:"fail",
            msg:"Internal Server Error"
        })
    }
}

exports.reportProfile = async(res, req, next) =>{
    try {
        const {target_id} = req.body;
        const user_id = req.user.user_id;
        const blockedOn = Date.now();

        const checkBlocked = await IdeaBlocked.findOne({$or:[{user_id:user_id,target_id:target_id},{user_id:target_id,target_id:user_id}]})
        if(checkBlocked !== null){
            res.status(200).json({
                status:"success",
                msg:"User have been already Blocked"
            })
        }else{
            const blocked = await IdeaBlocked.create({user_id, target_id, blockedOn})
            res.status(200).json({
                status:"success",
                msg:"User have been Blocked"
            })
        }

    } catch (error) {
        res.status(500).json({
            status:"fail",
            msg:"Internal Server Error"
        })
    }
}


exports.hideIdeaProfile = async(req, res, next) =>{
    try {
        const modeActivated = req.query.modeActivated;
        const user_id = req.user.user_id+"idea"

        const user = await IdeaData.findOneAndUpdate({_id:req.user.user_id}, modeActivated ,{
            new:true,
            runValidators:true
        });
        //finish this
        if(modeActivated === false){
                        
                const options = {
                    method: 'DELETE',
                    url: 'https://214977e994c46638.api-us.cometchat.io/v3/users',
                    headers: {apiKey: process.env.cometchat_api_key, 'Content-Type': 'application/json', Accept: 'application/json'},
                    data: {uidsToDeactivate:  [user_id]}
                };
                
                axios
                    .request(options)
                    .then(function (response) {
                    console.log(response.data);
                    })
                    .catch(function (error) {
                    console.error(error);
                    });
        }else{
            const options = {
                method: 'DELETE',
                url: 'https://214977e994c46638.api-us.cometchat.io/v3/users',
                headers: {apiKey: process.env.cometchat_api_key, 'Content-Type': 'application/json', Accept: 'application/json'},
                data: {uidsToDeactivate:  [user_id]}
            };
            
            axios
                .request(options)
                .then(function (response) {
                console.log(response.data);
                })
                .catch(function (error) {
                console.error(error);
                });
        }



        
        res.status(200).json({
            status:"success",
            user
        })
    } catch (e) {
        console.log("Error from route: "+e)
        res.status(500).json({
            status:"fail",
            msg:"Internal Server Error"
        })
    }
}