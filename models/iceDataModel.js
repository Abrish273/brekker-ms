const mongoose = require('mongoose')
const opts = { toJSON: { virtuals: true } };

const icebrekrrDataSchema = new mongoose.Schema({
    user_id:{type:String, unique: true},
    modeActivated:{type: Boolean, default:false},
    name: {type: String},
    bio: {type: String},
    height:{type: Number},//cms
    education:{type: String, enum:["HighSchool", "In College", "Undergraduate school", "In grad school", ]},
    religion:{type: String},
    activeStatus: {type: Boolean, default: true},
    gender:{type: String, enum: ["F", "M", "B"]},
    showGender:{type: Boolean, default: true},
    birthDate:{type: Date},
    sunsign:{type: String},
    interestedGender:{type: String, enum: ["F", "M", "B"]},
    languages:[{type: String}],
    workout:{type: String, enum: ["Sometimes", "Active", "Almost Never"]},
    political:{type: String},
    smokes:{type: String, enum: ["Never", "Socially", "Regular"]},
    alcohol:{type: String, enum: ["Never", "Socially", "Frequently", "Sober"]},
    lookingFor:{type: String, enum:["Relationship", "Date", "Casual", "Dont Know"]}, //dk => Dont know yet
    images:[{
        priority : {type: Number},
        image_URL:{type: String}
    }],
    interests:[{type: String}],
    verifiedProfile: {type: Boolean},
    location : {
        type : {
            type : String,
            enum : ['Point'],
        },
        coordinates : {
            type : [Number],
            // required : true
        }
    },
},{ timestamps: true }, opts)

icebrekrrDataSchema.virtual('age').get(function(){
    return Math.floor((Date.now() - this.birthDate.getTime()) / (1000 * 3600 * 24 * 365));
});

icebrekrrDataSchema.index({ location: "2dsphere" });

const myDB = mongoose.connection.useDb('ice_brekrr');
const IceData = myDB.model("IceData", icebrekrrDataSchema);
module.exports = IceData;