const IdeaData = require('../models/ideaDataModel')
const IdeaBlocked = require('../models/ideaBlockModel')
const sdk = require('api')('@cometchat/v3#ev191hl5kwgink');

exports.getIdeaProfile = async (req,res,next)=>{
    try {
        var user_id;
        // console.log(req.query.user_id)
        if(req.query.user_id != null){
            user_id=req.query.user_id;
            const user = await IdeaData.findOne({user_id:user_id});
            res.status(200).json({
                status:"success",
                user
            })
        }else{
            user_id = req.user.user_id;
            // console.log(user_id)
            const user = await IdeaData.findOne({user_id:user_id});
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
        var user = await IdeaData.findOne({user_id: req.body.user_id});
        if(user === null){
            user = await IdeaData.create(req.body);
            const uid = req.body.user_id + "idea";
            //create user for chats
            sdk['creates-user']({
              uid: uid,
              name: req.body.name,
              avatar: req.body.images[0].image_URL,
              withAuthToken: false,
            }, {
                apiKey: process.env.cometchat_api_key
            })
              .then(res => console.log(res))
              .catch(err => console.error(err));
                    
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
        const user = await IdeaData.findOneAndUpdate({user_id:req.user.user_id}, req.body,{
            new:true,
            runValidators:true
        });
        const uid = req.user.user_id + "idea";

        //finish this
        if(req.body.name && req.body.images &&  req.body.images[0].image_URL){
            sdk.updateUser({name: req.body.name , avatar: req.body.images[0].image_URL}, {uid: uid,  apiKey: process.env.cometchat_api_key})
              .then(res => console.log(res))
              .catch(err => console.error(err));
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