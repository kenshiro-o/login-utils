var mongoose = require("mongoose"),
  ObjectId = mongoose.Schema.ObjectId;

var PasswordResetTokenSchema = new mongoose.Schema({
  user: {type: ObjectId, ref: "User"},
  token: {type: String, required: true},
  expiry: {type: Date, required: true}
});

module.exports = mongoose.model("PasswordResetToken", PasswordResetTokenSchema);