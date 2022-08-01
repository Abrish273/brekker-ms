const mongoose = require('mongoose')

const iceBlockModel = new mongoose.Schema({
    user_id:{type: mongoose.Schema.ObjectId, ref: "IceData", required: true},
    target_id:{type: mongoose.Schema.ObjectId, ref: "IceData", required: true},
    blockedOn : { type : Date, default: Date.now() },
}, { timestamps: true })

const myDB = mongoose.connection.useDb('ice_brekrr');

const IceBlocked = myDB.model("IceBlocked", iceBlockModel);
module.exports = IceBlocked;