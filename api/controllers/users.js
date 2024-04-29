const User = require("../models/user");
const { generateToken } = require("../lib/token");
const bcrypt = require('bcryptjs');
const fs = require('fs');

const create = async (req, res) => {
  // const imageToBase64 = fs.readFileSync(req.body.imgUrl);
  // const base64Image = Buffer.from(imageToBase64).toString('base64');
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userDetails = {
      email: req.body.email,
      password: hashedPassword,
      username: req.body.username,
      // imgUrl: base64Image
    };

    const user = new User(userDetails);
    console.log(user);

    await user.save();

    console.log("User created, id:", user._id.toString());
    res.status(201).json({ message: `User created, id: ${user._id.toString()}` });
    
  } catch (err) {
    // console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const user = await User.find({ _id: req.user_id });
    user[0].imgUrl = req.body.imgUrl;

    await User.findOneAndUpdate({ _id: req.user_id }, user[0]);

    const token = generateToken(req.user_id);
    res.status(201).json({
      message: `User ${req.user_id} profile picture has been updated`,
      token: token,
    });
  } catch (error) {
    // console.log(error);
    res.status(400).json({ message: "Something went wrong" });
  }
};

const getUserDetails = async (req, res) => { 
  try {
    const user = await User.find({ _id: req.user_id });

    const token = generateToken(req.user_id);
    res.status(201).json({ userData: user, token: token });
  }
  catch {
    // console.log(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}

const UsersController = {
  create: create,
  updateProfilePicture: updateProfilePicture,
  getUserDetails, getUserDetails
};

module.exports = UsersController;
