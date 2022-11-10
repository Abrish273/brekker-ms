const IdeaData = require('../models/ideaDataModel');
const Likes = require('../models/idealikesSchema');
const User = require('../models/userModel');
const axios = require('axios').default;
const {sendNotif} =require('./Notifs')

exports.getRecommendations = async (req,res,next)=>{
    try {
        const userData = await IdeaData.findOne({_id:req.user.user_id}).select('lookingFor industry education activeStatus location languages');
        var latt, long; 
        if(!req.query.latt && !req.query.long){
            latt = userData.location.coordinates[1];
            long = userData.location.coordinates[0]; 

        }else{
            latt = req.query.latt;
            long= req.query.long;
        }

        var lookingFor1, industry, searchingFor;
        if(!req.query.industry){
            industry = userData.industry;
        }else{
            industry = req.query.industry;
        }

        
        if(!req.query.lookingFor){
            searchingFor = userData.lookingFor;
        }else{
            searchingFor = req.query.lookingFor
        }

        // lookingFor:
        // 'Network', 
        // 'Investor', 
        // 'Founder/Co-founder', 
        // "Ads and Marketing", 
        // 'App/Web Developer',
        // 'Freelancers', 
        // 'Collaboration', 
        // 'Mentor/Mentee', 
        // 'Project Manager',
        // 'UI/UX Designer',
        // 'Entrepreneur',
        // 'Work'
//         Roles:
// 'Entrepreneur',
// 'Investor',
// 'Founder/Co-founder',
// 'Ad's & Marketing',
// 'App/Web Developer',
// 'Freelancer',
// 'Mentor',
// 'Project Manager',
// 'UI/UX Designer',
// 'Graphic Designer',
// 'Researcher',
// 'Others'



        //Finish this
        if(searchingFor === "App/Web Developer" || searchingFor === "Freelancer" || searchingFor === "Project Manager" || searchingFor === "UI/UX Designer"|| searchingFor === "Graphic Designer"  ){
            lookingFor1 = ["App/Web Developer", "Freelancer", "Project Manager", "Mentor/Mentee", "UI/UX Designer","Graphic Designer", "Ad's & Marketing" ]
        } else if(searchingFor === "Investor" ||searchingFor === "Founder/Co-founder" ||searchingFor === "Entrepreneur" || searchingFor ==="Work/Get hired" ){
            lookingFor1= ["Investor", "Entrepreneur", "Founder/Co-founder"]
        } else {
            lookingFor1 = ["App/Web Developer", "Freelancer", "Project Manager", "Mentor/Mentee", "UI/UX Designer","Graphic Designer", "Ad's & Marketing", "Investor", "Entrepreneur", "Founder/Co-founder"]
        }


        // console.log(lookingFor1)
        var { page = 1, limit = 50 } = req.query;

        var seenProfiles = await Likes.find({user_id:req.user.user_id}).distinct('target_id')
        seenProfiles.push(req.user.user_id)

        const whoLikeYou = await Likes.find({target_id:req.user.user_id, status:0}).distinct('_id')
        var profilesWhoLikeYou = await IdeaData.find({_id: {$in:whoLikeYou}}).limit(limit * 1).skip((page - 1) * limit).lean();

        profilesWhoLikeYou.forEach(function (element) {
            element.likesYou = true;
        });


        if(req.plan.name ==="trial"){
            //Free plan
            const maxDistanceInMeters = 15000;
            if(page > 2 || req.query.distance > 15000){
                res.status(200).json({
                    status:"upgrade",
                    msg:"Upgrade to subscription plan for more profiles"
                })
            }
            var recommendedProfiles = await IdeaData.find({$and:[{myrole: {$in: lookingFor1}}, {_id: {$nin: seenProfiles}}, {industry: industry} ]}).limit(limit * 1).skip((page - 1) * limit)

            // const recommendedProfiles = await IdeaData.aggregate([{  
            //     $geoNear: {
            //         near: {
            //           type: "Point",
            //           coordinates: [Number(long),Number(latt)]
            //         },
            //         distanceField: "distance",
            //         spherical: true,
            //         maxDistance:  maxDistanceInMeters,
            //       }
            //    },{
            //     $match:{
            //         $and:[
            //             {lookingFor: {$in: lookingFor}}, {_id: {$nin: seenProfiles}}
            //         ]
            //     }
            //    }]).limit(limit * 1).skip((page - 1) * limit)
            
            if(recommendedProfiles.length < 1){
                   
                recommendedProfiles = await IdeaData.find({$and:[{_id: {$nin: seenProfiles}} ]}).limit(limit * 1).skip((page - 1) * limit)
                if(recommendedProfiles.length < 2){            
                   
                     recommendedProfiles = await IdeaData.aggregate([{
                        $geoNear: {
                            near: {
                              type: "Point",
                              coordinates: [Number(long),Number(latt)]
                            },
                            maxDistance:  maxDistanceInMeters,
                            distanceField: "distance",
                            spherical: true,
                            // distanceMultiplier: 0.001   
                          }
                       }])
                }
            }

               Array.prototype.push.apply(recommendedProfiles,profilesWhoLikeYou); 

            
            res.status(200).json({
                status:"success",
                plan:"trial",
                recommendedProfiles
            })
        }else {


            var maxDistanceInMeters = req.plan.locationLimit || req.query.distance;
            
            if(req.query.distance > req.plan.locationLimit){
                res.status(200).json({
                    status:"upgrade",
                    msg:"Distance exceeds plan limit",
                })
            }
          
            // const recommendedProfiles = await IdeaData.find({$and:[ {  location: {
            //     $near: {
            //      $maxDistance: maxDistanceInMeters,
            //      $geometry: {
            //       type: "Point",
            //       coordinates: [long, latt]
            //      },
            //     //  $spherical : true

            //     }
            //    }},{lookingFor: {$in: lookingFor}},{user_id: {$nin: seenProfiles,}} ]}).limit(limit * 1).skip((page - 1) * limit).lean()
            // const recommendedProfiles = await IdeaData.aggregate([{
            //     $geoNear: {
            //         near: {
            //           type: "Point",
            //           coordinates: [Number(long),Number(latt)]
            //         },
            //         distanceField: "distance",
            //         spherical: true,
            //         maxDistance:  maxDistanceInMeters,
            //       }
            //    },{
            //     $match:{
            //         $and:[
            //             {lookingFor: {$in: lookingFor}}, {_id: {$nin: seenProfiles}}
            //         ]
            //     }
            //    }]).limit(limit * 1).skip((page - 1) * limit)

            var recommendedProfiles = await IdeaData.find({$and:[{myrole: {$in: lookingFor1}}, {_id: {$nin: seenProfiles}}, {industry: industry} ]}).limit(limit * 1).skip((page - 1) * limit)
            if(recommendedProfiles.length < 1){
                   
                recommendedProfiles = await IdeaData.find({$and:[{_id: {$nin: seenProfiles}} ]}).limit(limit * 1).skip((page - 1) * limit)
                if(recommendedProfiles.length < 2){            
                   
                    recommendedProfiles = await IdeaData.aggregate([{
                       $geoNear: {
                           near: {
                             type: "Point",
                             coordinates: [Number(long),Number(latt)]
                           },
                           maxDistance:  maxDistanceInMeters,
                           distanceField: "distance",
                           spherical: true,
                           // distanceMultiplier: 0.001   
                         }
                      }])
               }
            }


            Array.prototype.push.apply(recommendedProfiles,profilesWhoLikeYou); 

            res.status(200).json({
                status:"success",
                plan: req.plan.name,
                count: recommendedProfiles.length,
                recommendedProfiles 
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
        const {user_id, target_id, action, user1,user2} = req.body;
        const result = await Likes.findOne({user_id:user_id, target_id:target_id});
        const pokes = await User.findOne({_id:req.user.user_id}).select('pokesLeft -_id')
        var pokesLeft = Number(pokes.pokesLeft)
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
                    acceptedDate: new Date()
                })
                const frndid = target_id+"idea";
                const userdid = user_id+"idea";
                // Create a room for chat
                const options = {
                    method: 'POST',
                    url: `https://${process.env.cometchat_app_id}.api-us.cometchat.io/v3/users/${userdid}/friends`,
                    headers: {apiKey: process.env.cometchat_api_key, 'Content-Type': 'application/json', Accept: 'application/json'},
                    data: {accepted: [`${frndid}`]}
                    };
    
                   await axios
                    .request(options)
                    .then(function (response) {
                        console.log(response.data);
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
    
                // send Notification
                const user1Token = await User.findOne({_id:user_id}).select('notifToken -_id')
                const user2Token = await User.findOne({_id:target_id}).select('notifToken -_id')
                let title= "Its a Connect"
                let body = "You have matched with a connect"
                let redirectUrl = "/ideabrekrr/chats"
                await sendNotif([user1Token, user2Token],title,body, redirectUrl)

                if(action === "poke"){
                    pokesLeft= pokesLeft-1;
                }

                
                res.status(200).json({
                    status:"success",
                    msg:"Its a Match",
                    pokesLeft
                })
            }else {
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
                        await sendNotif([user2token], title, body, imgUrl, redirectUrl)
                        pokesLeft = pokesLeft - 1;
                        const pokesData = await User.findOneAndUpdate({_id:user_id},{pokesLeft: pokesLeft});
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
        console.log(error)
        res.status(500).json({
            status:"fail",
            msg:"Internal Server Error"
        })
    }
}


exports.disLikeProfile = async (req,res) =>{
  try {
        const {user_id, target_id} = req.body;
        const result = await Likes.findOne({user_id:user_id, target_id:target_id});
        console.log(result)
        if(result && result.length!==0){
            const id = result._id
            const data = await Likes.findOneAndUpdate({_id: id}, {
                status:-1,
                acceptedDate: new Date()
            })
            res.status(200).json({
                status:"success",
                msg:"Profile Disliked",
            })
        }else{
            const result1 = await Likes.findOne({user_id:target_id, target_id:user_id});
            console.log(result1)
            if(result1 && result1!==0){
                const id = result1._id
                const data = await Likes.findOneAndUpdate({_id: id}, {
                    status:-1,
                    acceptedDate: new Date()
                })
              
                res.status(200).json({
                    status:"success",
                    msg:"Profile Disliked",
                })
            }else{
                let status = -1
                const dislike = await Likes.create({user_id,target_id,status})
                res.status(200).json({
                    status:"success",
                    msg:"Profile Disliked",
                })
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

exports.AroundMe = async (req,res) =>{
    try {
        const userData = await IdeaData.findOne({_id:req.user.user_id}).select('lookingFor industry education activeStatus location languages');

        var latt, long; 
        
        latt = userData.location.coordinates[1];
        long = userData.location.coordinates[0]; 
        const maxDistanceInMeters = 15000;

        var seenProfiles = await Likes.find({user_id:req.user.user_id}).distinct('target_id')
        seenProfiles.push(req.user.user_id)

       
        var profilesNearMe1 = await IdeaData.aggregate([{
            $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [Number(long),Number(latt)]
                },
                maxDistance:  maxDistanceInMeters,
                distanceField: "distance",
                spherical: true,
                // distanceMultiplier: 0.001   
              }
           },{
            $count: "nearMe"
            }])

            let profilesNearMe = (profilesNearMe1[0]) ? profilesNearMe1[0].nearMe : 0 ;

            res.status(200).json({
             status:"success",
             profilesNearMe,
 
         })
 



    } catch (error) {
        console.log(error)
        res.status(500).json({
            status:"fail",
            msg:"Internal Server Error"

        })
    }
}
