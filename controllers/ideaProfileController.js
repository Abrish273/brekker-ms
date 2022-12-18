const IdeaData = require('../models/ideaDataModel')
const IdeaBlocked = require('../models/ideaBlockModel')
const Likes = require('../models/idealikesSchema');
const {sendNotif} =require('./Notifs')

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
        console.log("Error from get profile route: "+e)
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
            req.body._id = req.body.user_id;
            delete req.body.user_id
            user = await IdeaData.create(req.body);            
                    
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
        console.log("Error from register profile route: "+e)
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

       
        res.status(200).json({
            status:"success",
            user
        })
    } catch (e) {
        console.log("Error from update profile route: "+e)
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
        const blockedOn = new Date();
        var status = -2

        const checkBlocked = await IdeaBlocked.findOne({$or:[{user_id:user_id,target_id:target_id},{user_id:target_id,target_id:user_id}]})
        if(checkBlocked !== null){
            res.status(200).json({
                status:"success",
                msg:"User have been already Blocked"
            })
        }else{

            const result = await Likes.findOne({user_id:user_id, target_id:target_id});
            if(result && result.length!==0){
                const result1 = await Likes.findByIdAndUpdate(result._id, {status: status})    
                const blocked = await IdeaBlocked.create({user_id, target_id, blockedOn})
                res.status(200).json({
                    status:"success",
                    msg:"User have been Blocked"
                })
            }else{
                const result22 = await Likes.findOne({user_id:target_id, target_id:user_id});
                if(result22 && result22.length!==0){
                    const result3 = await Likes.findByIdAndUpdate(result22._id, {status: status})               
                    const blocked = await IdeaBlocked.create({user_id, target_id, blockedOn})
                    res.status(200).json({
                        status:"success",
                        msg:"User have been Blocked"
                    })
                }else{
                    var action ="block"
                    const like11 = await Likes.create({user_id, target_id, action, status })       
                    const blocked = await IdeaBlocked.create({user_id, target_id, blockedOn})

                    res.status(200).json({
                        status:"success",
                        msg:"User have been Blocked"
                    })
                }
            }

            res.status(200).json({
                status:"success",
                msg:"User have been Blocked"
            })
        }

    } catch (error) {
        console.log("Error from report route: "+error)
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
        // console.log(modeActivated)
        const user = await IdeaData.findOneAndUpdate({_id:req.user.user_id}, {modeActivated:modeActivated});

        res.status(200).json({
            status:"success",
            user
        })
    } catch (e) {
        console.log("Error from hide route: "+e)
        res.status(500).json({
            status:"fail",
            msg:"Internal Server Error"
        })
    }
}

exports.notifTest = async(req, res, next) =>{
    try {
        const {notifToken, title, body, redirectUrl} = req.body
        await sendNotif([notifToken],title,body, redirectUrl)

        res.status(200).json({
            status:"success",
            msg:"notif Sent"
        })
    } catch (e) {
        console.log("Error from notif route: "+e)
        res.status(500).json({
            status:"fail",
            msg:"Internal Server Error"
        })
    }
}