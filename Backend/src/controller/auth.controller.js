import { generateToken } from "../lib/util.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  //hash password

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are require",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "password need 6 letter",
      });
    }

    const user = await User.findOne({ email });

    // console.log(user, "user .....");

    if (user) {
      return res.status(400).json({
        message: "Email alredy exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashPassword,
    });

    if (newUser) {
      //generate jwt here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("error in signup controller", error.stack);
    res
      .status(500)
      .json({ message: "internal server error in signup controller " });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are require",
      });
    }
    if (!user) {
      return res.status(400).json({
        message: "Incorrect Email",
      });
    }

    const ispasswordCorrect = await bcrypt.compare(password, user.password);

    if (!ispasswordCorrect) {
      return res.status(400).json({
        message: "Incorrect Password",
      });
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("error in signin controller", error.message);
    res
      .status(500)
      .json({ message: "internal server error in signin controller" });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout Done!!" });
  } catch (error) {
    console.log("error in logout controller", error.message);
    res
      .status(500)
      .json({ message: "internal server error in logout controller" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      res.status(400).json({ message: " Profile Pic require" });
    }
    const uplodresponse = await cloudinary.uploader.upload(profilePic); // i add cloudinary.uploader.upload   instade of cloudinary.uploader(profilePic)  // i mistake to add .upload

    const updateuser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uplodresponse.secure_url,
      },
      { new: true }
    );
    res.status(200).json(updateuser);
  } catch (error) {
    console.log(" update profile controller error", error.message);
    res
      .status(500)
      .json({ message: "internal server error in profile controller" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("checkAuth controller  error", error.message);
    res
      .status(500)
      .json({ message: "internal server error in checkAuth controller" });
  }
};
