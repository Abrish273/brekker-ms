const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user_id:{type: String,required: true,unique:true},
    name:{type: String},
    email:{type:String},
    phone:{type:String},
    notifToken:{type:String},
    signinProvider:{type:String},
    initialMode:{type: String, enum: ["ICE", "IDEA"]},
    verification: {type: Boolean, default: false},
    location : {
        type : {
            type : String,
            enum : ['Point'],
        },
        coordinates : {
            type : [Number],
        }
    },
    hometown:{type: String},
    iceOnboarding: {type: Boolean, default:false},
    ideaOnboarding: {type: Boolean, default:false},
    loggedThru:{type:String},
    lastLogin:{type:Date, default: Date.now()},   
    pokesLeft:{type:Number, default:5},
    subscriptionPlan:{type: String, enum:["trial","day","week","month","year" ], default: "trial"},
    planExpiry: { type: Date},
},{ timestamps: true })

userSchema.index({ location: "2dsphere" });
const myDB = mongoose.connection.useDb('Users');

const User = myDB.model("User", userSchema);
module.exports = User;

//Todo : update this
// icognitomode
// accountCreation
// snoozemood
// dateMode
// Queries
// Notification Settings
// reminders for payments



