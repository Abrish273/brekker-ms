const IdeaData = require('../models/ideaDataModel');
const Likes = require('../models/idealikesSchema');
const User = require('../models/userModel');
const axios = require('axios').default;
const {sendNotif} =require('./Notifs')

exports.getRecommendations = async (req,res,next)=>{
    try {
        const userData = await IdeaData.findOne({user_id:req.user.user_id}).select('lookingFor industry education activeStatus location languages');
        var latt, long; 
        if(!req.query.latt && !req.query.long){
            latt = userData.location.coordinates[1];
            long = userData.location.coordinates[0]; 
        }else{
            latt = req.query.latt;
            long= req.query.long;
        }

        var lookingFor, industry;
        if(!req.query.industry){
            industry = userData.industry;
        }else{
            industry = req.query.industry;
        }
        if(!req.query.lookingFor){
            if(userData.lookingFor==="People to hire" || userData.lookingFor=== "Network"){
                lookingFor = ["Internship", "Freelance", "Part-time Job", "Full-time Job", "Investors"]
            }else{
                lookingFor = ["People to hire", "Network", "Investors"]
            }
        }else{
            lookingFor = [req.query.lookingFor];
        }

        const { page = 1, limit = 50 } = req.query;

        const seenProfiles = await Likes.find({user_id:req.user.user_id}).distinct('target_id')

        if(req.plan.name ==="trial"){
            //Free plan
            const maxDistanceInMeters = 5000;
            if(page > 2 || req.query.distance > 5000){
                res.status(200).json({
                    status:"upgrade",
                    msg:"Upgrade to subscription plan for more profiles"
                })
            }
            const profiles = await IdeaData.find({$and:[ {  location: {
                $near: {
                 $maxDistance: maxDistanceInMeters,
                 $geometry: {
                  type: "Point",
                  coordinates: [long, latt]
                 },
                //  $spherical : true

                }
               }}, {lookingFor: {$in: lookingFor}}, {user_id: {$nin: seenProfiles}} ]}).limit(limit * 1).skip((page - 1) * limit)
            
            res.status(200).json({
                status:"success",
                profiles
            })
        }else {
            const whoLikeYou = await Likes.find({target_id:req.user.user_id, status:0}).distinct('_id')
            var profilesWhoLikeYou = await Icedata.find({user_id: {$in:whoLikeYou}}).lean()
            profilesWhoLikeYou = profilesWhoLikeYou.map(v => ({...v, likesYou: true}))

            var maxDistanceInMeters = req.plan.locationLimit || req.query.distance;
            
            if(rep.query.distance > req.plan.locationLimit){
                res.status(200).json({
                    status:"upgrade",
                    msg:"Distance exceeds plan limit",
                })
            }
          
            const recommendedProfiles = await IceData.find({$and:[ {  location: {
                $near: {
                 $maxDistance: maxDistanceInMeters,
                 $geometry: {
                  type: "Point",
                  coordinates: [long, latt]
                 },
                //  $spherical : true

                }
               }},{lookingFor: {$in: lookingFor}},{user_id: {$nin: seenProfiles}} ]}).limit(limit * 1).skip((page - 1) * limit).lean()
            
               Array.prototype.push.apply(recommendedProfiles,profilesWhoLikeYou); 

            res.status(200).json({
                status:"success",
                profiles
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

exports.likeProfile = async (req,res) =>{
    try {
        const {user_id, target_id, action } = req.body;
        const result = await Likes.findOne({user_id:user_id, target_id:target_id});
        const pokes = await User.find({user_id:user_id}).select('pokesLeft -_id')
        var pokesLeft = pokes.pokesLeft
        // console.log(result)
        if(result && result.length!==0){
            res.status(200).json({
                status:"success",
                msg:"This Record already exists in the system", 
            })
        }else{
            const result1 = await Likes.findOne({user_id:target_id, target_id:user_id});
            if(result1 && result1!==0){
                const id = result1._id
                const data = await Likes.findOneAndUpdate({_id: id}, {
                    status:1,
                    acceptedDate: new Date.now()
                })
                const frndid = target_id+"idea";
                const userdid = user_id+"idea";
                // Create a room for chat
                const options = {
                    method: 'POST',
                    url: `https://214977e994c46638.api-us.cometchat.io/v3/users/${userdid}/friends`,
                    headers: {apiKey: process.env.cometchat_api_key, 'Content-Type': 'application/json', Accept: 'application/json'},
                    data: {accepted: [`${frndid}`]}
                    };
    
                    axios
                    .request(options)
                    .then(function (response) {
                        console.log(response.data);
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
    
                // send Notification
                const user1token = await User.findOne({user_id:user_id}).select('notifToken -_id')
                const user2token = await User.findOne({user_id:target_id}).select('notifToken -_id')
                let title= "Its a Connect"
                let body = "You have matched with a connect"
                let redirectUrl = "/ideabrekrr/chats"
                await sendNotif([user1Token, user2Token],title,body, redirectUrl)

                
                res.status(200).json({
                    status:"success",
                    msg:"Its a Match",
                })
            }else {
                const like = await Likes.create({user_id, target_id, user1, user2, action })
                // if action === poke, send notification. 
                // create room for chat
                if(action==="poke"){
                    if(pokesLeft>0){

                        // const user1token = await User.findOne({user_id:user_id}).select('notifToken -_id')
                        const user2token = await User.findOne({user_id:target_id}).select('notifToken -_id')
                        const title =`${user1.name} has poked you`
                        const body=`Hey ${user2.name}, ${user1.name} is interested to talk with you.`
                        const imgUrl =""
                        const redirectUrl ="/ideabrekrr/profile/:id"
                        await sendNotif([user2token], title, Body, imgUrl, redirectUrl)
                        pokesLeft = pokesLeft - 1;
                        const pokesData = await User.findOneAndUpdate({user_id:user_id},pokesLeft);
                        const like = await Likes.create({user_id, target_id, user1, user2, action })
                        res.status(200).json({
                                status:"success",
                                like,
                                pokesLeft, 
                            })
                    }else{
                        res.status(200).json({
                            status:"upgrade",
                            msg:"No Pokes Left, Please Upgrade",
                            pokesLeft,
                        })
                    }
                }else{
                    const like = await Likes.create({user_id, target_id, user1, user2, action })
                    res.status(200).json({
                        status:"success",
                        like
                    })
                }
            }
        }

    } catch (error) {
        // console.log(error)
        res.status(500).json({
            status:"fail",
            msg:"Internal Server Error"
        })
    }
}


exports.disLikeProfile = async (req,res) =>{
  try {
        const {user_id, target_id } = req.body;
        const result = await Likes.findOne({user_id:user_id, target_id:target_id});
        // console.log(result)
        if(result && result.length!==0){
            const id = result1._id
            const data = await Likes.findOneAndUpdate({_id: id}, {
                status:-1,
                acceptedDate: new Date.now()
            })
            res.status(200).json({
                status:"success",
                msg:"Profile Disliked",
            })
        }else{
            const result1 = await Likes.findOne({user_id:target_id, target_id:user_id});
            if(result1 && result1!==0){
                const id = result1._id
                const data = await Likes.findOneAndUpdate({_id: id}, {
                    status:-1,
                    acceptedDate: new Date.now()
                })
              
                res.status(200).json({
                    status:"success",
                    msg:"Profile Disliked",
                })
            }
        }
    } catch (error) {
        // console.log(error)
        res.status(400).json({
            status:"fail",
            msg:"Internal Server Error"

        })
    }
}


exports.likedProfiles = async (req,res) =>{
    try {
        const user_id = req.body.user_id;
        const whoLikesMe = await Likes.find({$and:[{target_id:user_id}, {status:0}]}).sort({createdAt:-1}).select('user_id user1 action')

        res.status(200).json({
            status:"success",
            whoLikesMe
        })
    } catch (error) {
        res.status(500).json({
            status:"fail",
            msg:"Internal Server Error"

        })
    }
}

exports.matchedProfiles = async (req,res) =>{
    try {
        const user_id = req.body.user_id;
        const whoLikesMe = await Likes.find({$and:[{$or:[{user_id:user_id},{target_id:user_id}]}, {status:1}]}).sort({createdAt:-1})
        
        res.status(200).json({
            status:"success",
            whoLikesMe
        })
    } catch (error) {
        res.status(500).json({
            status:"fail",
            msg:"Internal Server Error"

        })
    }
}
