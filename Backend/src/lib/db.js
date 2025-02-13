import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL);
    console.log("Mongodb Connected Done!!");
  } catch (error) {
    console.log("Mongodb NOT Connect!!", error);
  }
};
