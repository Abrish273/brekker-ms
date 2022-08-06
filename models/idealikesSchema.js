const mongoose = require('mongoose')

const likesSchema = new mongoose.Schema({
    user_id:{type: String, required: true},
    target_id:{type: String, required: true},
    action: {type: String, enum:["like","poke"]},
    user1:{
        username:{type: String},
        user_image:{type: String} 
    },
    user2:{
        username:{type: String},
        user_image:{type: String} 
    },
    status:{type: Number },// [0=pending, 1= accepted, -1 = rejected]
    likedOn : { type : Date, default: Date.now() },
    acceptedOn : { type : Date },
}, { timestamps: true })

const myDB = mongoose.connection.useDb(`idea_brekrr-${process.env.envtype}`);

const Likes = myDB.model("Likes", likesSchema);
module.exports = Likes;