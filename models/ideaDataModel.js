const mongoose = require('mongoose')
const opts = { toJSON: { virtuals: true } };

const ideabrekrrDataSchema = new mongoose.Schema({
    user_id:{type:String},
    headline:{type: String},
    name:{type: String},
    bio: {type: String},
    activeStatus: {type: Boolean, default: true},
    gender:{type: String, enum: ["F", "M", "B"]},
    showGender:{type: Boolean, default: true},
    birthDate:{type: Date},
    lookingFor:{type: String}, // enum:["Investor", "Network","Mentee/Mentor","Internship", "Freelance", "Part-time Job", "Full-time Job", "People to hire"]
    industry:{type: String},
    experience:{type: String},
    educationLevel:{type: String}, //enum:["HighSchool", "In College", "Undergraduate school", "In grad school", ]
    images:[{
        priority : {type: Number, default: 1},
        image_URL:{type: String}
    }],
    work:[{
        title: {type: String},
        company: {type: String},
        from: {type: String},
        to: {type: String},
    }],
    education:[{
        fieldOfStudy: {type: String},
        institution: {type: String},
        graduationYear: {type: String},
    }],
    languages:[{type: String}],
    completionStatus:{type: Number},
    verifiedProfile: {type: Boolean},
    location : {
        type : {
            type : String,
            enum : ['Point']
        },
        coordinates : {
            type : [Number],
            // required : true
        }
    },
}, opts)

ideabrekrrDataSchema.virtual('age').get(function(){
    return Math.floor((Date.now() - this.birthDate.getTime()) / (1000 * 3600 * 24 * 365));
});

ideabrekrrDataSchema.index({ location: "2dsphere" });

const myDB = mongoose.connection.useDb('idea_brekrr');
const IdeaData = myDB.model("IdeaData", ideabrekrrDataSchema);
module.exports = IdeaData;