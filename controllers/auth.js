const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const register = async (name, email, password) => {
  try {
    const isExistingUser = await User.findOne({ email: email });
    if (isExistingUser) throw new Error("user already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = new User({
      name,
      email,
      password: hashedPassword,
    });

    const userResponse = await userData.save();
    const id = userResponse._id;
    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET);

    const data = {
      message: "User regitered Successfully",
      token: token,
      name: name,
    };
    return data;
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};

const login = async (email, password) => {
  try {
    const userDetails = await User.findOne({ email });
    if (!userDetails) throw new Error("Invalid Credentials");

    const passwordMatch = await bcrypt.compare(password, userDetails.password);
    if (!passwordMatch) throw new Error("Invalid Credentials");

    const token = jwt.sign({ userId: userDetails._id }, process.env.JWT_SECRET);
    const data = {
      message: "User logged in successfully",
      token: token,
      name: userDetails.name,
    };
    return data;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

module.exports = { register, login };
