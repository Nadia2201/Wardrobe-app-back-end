const mongoose = require("mongoose");

const OutfitSchema = new mongoose.Schema({
  //automatically generated name: { type: String },
  top: { type: String, required: true },
  bottom: { type: String },
  shoes: { type: String, required: true },
  // created at: Date
  // favourite: { type: boolean, default: false} 
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
