import express from "express";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { app, serverof } from "./lib/soket.io.js";

import path from "path";

dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json()); // always use this file in top before route

app.use(cookieparser());
app.use(
  cors({
    origin: "http://localhost:5173", // "http://localhost:5173/" type mistake "/"
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.use("/api", (req, res) => {
  res.status(200).json({ message: "hello Express" });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
  });
}

serverof.listen(PORT, async () => {
  console.log("Server is running on PORT: " + PORT); // i add this newone
  // console.log(`Server is running on PORT:${PORT}`);
  await connectDB();
});
