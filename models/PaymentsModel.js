var mongoose = require("mongoose");
var PaymentsSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    value:{type:String},
    status:{type:String},
    plan:{type: String, enum:["day","week","month"]},
    paymentDate: { type: Date },
    orderId:{type: String},
    ExpiresIn :{type: String, default:"30 Days"}
},{ timestamps: true }
);

const myDB = mongoose.connection.useDb(`Users-${process.env.envtype}`);
module.exports = myDB.model("Payments", PaymentsSchema);