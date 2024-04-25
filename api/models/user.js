const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  imgUrl: { type: Buffer}, // Base64 encoded image
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
