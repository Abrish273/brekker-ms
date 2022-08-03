const mongoose = require('mongoose')

const ideaBlockModel = new mongoose.Schema({
    user_id:{type: mongoose.Schema.ObjectId, ref: "IdeaData", required: true},
    target_id:{type: mongoose.Schema.ObjectId, ref: "IdeaData", required: true},
    blockedOn : { type : Date, default: Date.now() },
}, { timestamps: true })

const myDB = mongoose.connection.useDb(`idea_brekrr-${process.env.envtype}`);

const IdeaBlocked = myDB.model("IdeaBlocked", ideaBlockModel);
module.exports = IdeaBlocked;