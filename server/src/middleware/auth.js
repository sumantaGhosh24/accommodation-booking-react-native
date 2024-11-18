import jwt from "jsonwebtoken";

import User from "../models/userModel.js";

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({message: "Unauthorized"});
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        res.clearCookie("jwt", {httpOnly: true});
        return res.status(403).json({message: "Forbidden"});
      }
      req.user = await User.findById(decoded.id).select("-password");
      next();
    });
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
};

export default auth;
