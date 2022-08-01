const Payments = require("../models/PaymentsModel");
const User = require("../models/userModel");

const checkForPlan = async (req,res,next) =>{
    const user_id = req.user.user_id;
    if(!user_id){
        return res.status(401).json({status:'fail', message:'unauthorized'})
    }
    req.plan ={}
    const userPlan = await User.findOne({user_id:user_id}).select('subscriptionPlan');
    if(userPlan && userPlan !== 0 ){
        // console.log(userPlan.subscriptionPlan)
        req.plan.name = userPlan.subscriptionPlan;
        if(req.plan.name === "day"){
            req.plan.locationLimit = 10000;
        }else if(req.plan.name === "week"){
            req.plan.locationLimit = 35000;
        } else if(req.plan.name =="month"){
            req.plan.locationLimit = 20000000;
        } else if(req.plan.name ==="trial"){
            req.plan.locationLimit = 5000;
        }
        // console.log(req.plan.name)
        
        next()
    }else{
        return res.status(401).json({status:'fail', message:'user doesnt exist'})
    }
}

module.exports = checkForPlan;