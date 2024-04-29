// controllers/users.js

const User = require("../models/user");
const { generateToken } = require("../lib/token");
const bcrypt = require('bcryptjs');
const fs = require('fs');
const JWT = require("jsonwebtoken");

const create = async (req, res) => {

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userDetails = {
      email: req.body.email,
      password: hashedPassword,
      username: req.body.username,

    };

    const user = new User(userDetails);
    await user.save();

    console.log("User created, id:", user._id.toString());
    res.status(201).json({ message: `User created, id: ${user._id.toString()}` });
    
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Something went wrong" });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle image upload and convert to base64
    const imageToBase64 = fs.readFileSync(req.body.imgUrl);
    const base64Image = Buffer.from(imageToBase64).toString('base64');

    // Update the user's imgUrl with base64 data
    user.imgUrl = base64Image;
    await user.save();

    const token = generateToken(req.user_id);
    res.status(200).json({
      message: `User ${req.user_id} profile picture has been updated`,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserDetails = async (req, res) => { 
  try {
    const user = await User.findById(req.user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = generateToken(req.user_id);
    res.status(200).json({ userData: user, token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const logout = async (req, res) => {
  try {
    // Optionally perform token invalidation logic or cleanup tasks here
    // For example, you can simply send a success message for logout
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const UsersController = {
  create: create,
  updateProfilePicture: updateProfilePicture,
  getUserDetails: getUserDetails,
  logout: logout, // Add the logout function here
};

module.exports = UsersController;
