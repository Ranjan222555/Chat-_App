import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; /// type error cookie

    if (!token) {
      return res
        .status(401)
        .json({ message: "NO token provided in auth.middleware" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res
        .status(401)
        .json({ message: "Invalid token in auth.middleware" });
    }

    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "user not found in auth.middleware" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("protectRoute error in auth.middleware", error.message);
    res.status(500).json({
      message: "internal server error in protectRoute in auth.middleware",
    });
  }
};
