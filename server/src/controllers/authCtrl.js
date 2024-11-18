import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";

const authCtrl = {
  register: async (req, res) => {
    try {
      const {email, mobileNumber, password, cf_password} = req.body;

      const errors = [];
      for (const key in req.body) {
        if (!req.body[key]) {
          errors.push(`Please Fill ${key} Field.`);
        }
      }
      if (errors.length > 0) {
        return res.json({message: errors, success: false});
      }

      if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        return res.json({
          message: "Please Enter a Valid Email.",
          success: false,
        });
      }

      if (!mobileNumber.match(/^\d{10}$/)) {
        return res.json({
          message: "Please Enter a Valid Mobile Number.",
          success: false,
        });
      }

      const userEmail = await User.findOne({email});
      if (userEmail) {
        return res.json({
          message: "This Email Already Register.",
          success: false,
        });
      }

      const userMobileNumber = await User.findOne({mobileNumber});
      if (userMobileNumber) {
        return res.json({
          message: "This Mobile Number Already Register.",
          success: false,
        });
      }

      if (password.length < 6) {
        return res.json({
          message: "Password Length must be 6 Character Long.",
          success: false,
        });
      }
      if (password !== cf_password) {
        return res.json({
          message: "Password and Confirm Password not Match.",
          success: false,
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        mobileNumber,
        password: passwordHash,
      });
      await newUser.save();

      return res.json({
        message: "User registration successful.",
        success: true,
      });
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  login: async (req, res) => {
    try {
      const {email, password} = req.body;

      const errors = [];
      for (const key in req.body) {
        if (!req.body[key]) {
          errors.push(`Please fill ${key} field.`);
        }
      }
      if (errors.length > 0) {
        return res.json({message: errors, success: false});
      }

      const user = await User.findOne({email});
      if (!user)
        return res.json({message: "User doest not Exists.", success: false});

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.json({
          message: "Invalid Login Credentials.",
          success: false,
        });

      const accesstoken = createAccessToken({
        id: user._id,
      });

      return res.json({
        accesstoken,
        success: true,
        message: "User login successful!",
      });
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
};

export default authCtrl;
