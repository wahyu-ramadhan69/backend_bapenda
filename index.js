import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import loketRoute from "./router/Loket.js";
import kasirRoute from "./router/Kasir.js";
import pbbRoute from "./router/Pbb.js";
import userRoute from "./router/User.js";
import bphtbRoute from "./router/Bphtb.js";
import spptPbb from "./router/Spptpbb.js";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use(loketRoute);
app.use(kasirRoute);
app.use(userRoute);
app.use(pbbRoute);
app.use(bphtbRoute);
app.use(spptPbb);

let onlineUsers = [];

const addNewUser = (username, socketId) => {
  // !onlineUsers.some((user) => user.username === username) &&
  onlineUsers.push({ username, socketId });
  return { username, socketId };
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  socket.on("newUser", (username) => {
    const receiver = addNewUser(username, socket.id);
    socket.emit("sendUser", receiver);
  });

  socket.on("sendNotification", ({ senderName, nomer }) => {
    io.emit("getNotification", {
      senderName,
      nomer,
    });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

httpServer.listen(process.env.PORT, () => {
  console.log(`aplikasi berjalan pada port 8080`);
});
