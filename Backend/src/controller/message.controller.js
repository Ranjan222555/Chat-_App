import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";
import { getReceiverSocketId, io } from "../lib/soket.io.js";

export const getUserforSidebar = async (req, res) => {
  try {
    const loginUserId = req.user._id;
    const filterUser = await User.find({ _id: { $ne: loginUserId } }).select(
      "-password"
    );

    res.status(200).json(filterUser);
  } catch (error) {
    console.log(
      "error in getUserforSidebar message Controller controller ",
      error.message
    );
    res.status(500).json({
      message: "internal server error in getUserforSidebar message Controller ",
    });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const message = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    });

    res.status(200).json(message);
  } catch (error) {
    console.log("error in getMessage message Controller ", error.message);
    res.status(500).json({
      message: "internal server error in getMessage in message Controller ",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params; // this comment
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      //uplod image to cloudinary
      const uplodresponse = await cloudinary.uploader.upload(image);
      imageUrl = uplodresponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // todo: of socket io ....

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in sendMessage in message Controller  ", error.message);
    res.status(500).json({
      message: "internal server error in sendMessage in message Controller",
    });
  }
};
