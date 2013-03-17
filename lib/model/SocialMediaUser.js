var mongoose = require("mongoose"),
  ObjectId = mongoose.Schema.ObjectId;

/**
 *
 * The SocialMediaUser is a subset of a user
 */
var SocialMediaUserSchema = new mongoose.Schema({
  providerName: {type: String, required: true},
  providerUserId: {type: String, required: true},
  displayName: {type: String, required: true},
  user: {type: ObjectId, ref: "User"}
});

module.exports = mongoose.model("SocialMediaUser", SocialMediaUserSchema);