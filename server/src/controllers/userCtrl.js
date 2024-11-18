import User from "../models/userModel.js";

const userCtrl = {
  userImage: async (req, res) => {
    try {
      const {image} = req.body;

      if (!image) {
        return res.json({message: "Image is required", success: false});
      }

      const user = await User.findByIdAndUpdate(req.user._id, {
        image: image,
      });
      if (!user) {
        return res.json({message: "User does not exists.", success: false});
      }

      return res.json({message: "User image updated.", success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  userData: async (req, res) => {
    try {
      const {firstName, lastName, username, dob, gender} = req.body;

      const errors = [];
      for (const key in req.body) {
        if (!req.body[key]) {
          errors.push(`Please fill ${key} field.`);
        }
      }

      if (errors.length > 0) {
        return res.json({message: errors, success: false});
      }

      const matchUsername = await User.findOne({username});
      if (matchUsername) {
        return res.json({
          message: "This username already register, try another one.",
          success: false,
        });
      }

      const user = await User.findByIdAndUpdate(req.user._id, {
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        username: username.toLowerCase(),
        image: req.body.image,
        dob,
        gender: gender.toLowerCase(),
      });
      if (!user) {
        return res.json({message: "User does not exists.", success: false});
      }

      return res.json({message: "User data updated.", success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  userAddress: async (req, res) => {
    try {
      const {city, state, country, zip, addressline} = req.body;

      const errors = [];
      for (const key in req.body) {
        if (!req.body[key]) {
          errors.push(`Please fill ${key} field.`);
        }
      }
      if (errors.length > 0) {
        return res.json({message: errors, success: false});
      }

      const user = await User.findByIdAndUpdate(req.user._id, {
        city: city.toLowerCase(),
        state: state.toLowerCase(),
        country: country.toLowerCase(),
        zip,
        addressline: addressline.toLowerCase(),
      });
      if (!user) {
        return res.json({message: "User does not exists.", success: false});
      }

      return res.json({message: "User address updated.", success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  resetPassword: async (req, res) => {
    try {
      const {previousPassword, newPassword, cf_newPassword} = req.body;

      const errors = [];
      for (const key in req.body) {
        if (!req.body[key]) {
          errors.push(`Please fill ${key} field.`);
        }
      }
      if (errors.length > 0) {
        return res.json({message: errors, success: false});
      }

      const user = await User.findById(req.user._id);
      const isMatch = await bcrypt.compare(previousPassword, user.password);
      if (!isMatch) {
        return res.json({
          message: "Invalid login credentials.",
          success: false,
        });
      }
      if (newPassword != cf_newPassword) {
        return res.json({
          message: "Password and Confirm Password not match.",
          success: false,
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updateUser = await User.findByIdAndUpdate(req.user._id, {
        password: hashedPassword,
      });
      if (!updateUser) {
        return res.json({message: "User does not exists.", success: false});
      }

      return res.json({message: "Password reset successfully!", success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password");

      return res.json({users, success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  getMe: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select(
        "_id email mobileNumber firstName lastName username image dob gender city state country zip addressline role createdAt updatedAt"
      );

      return res.json({user, success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
};

export default userCtrl;
