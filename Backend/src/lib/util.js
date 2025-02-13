import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // milisecond
    httpOnly: true, //prevent  scripting attack
    sameSite: "strict", // CSRF attacks cross-site req
    secure: process.env.NODE_ENV !== "devlopment",
  });

  return token;
};
