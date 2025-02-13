import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const serverof = http.createServer(app);

const io = new Server(serverof, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

//uesd to store online users
const userSocketMap = {}; // {userId : socketId}

io.on("connection", (socket) => {
  // console.log("A user Connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  //io.emit() is used to send event to all the connected client
  io.emit("getOnlineUser", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    // console.log("A user disconnect", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUser", Object.keys(userSocketMap));
  });
});

export { io, app, serverof };
