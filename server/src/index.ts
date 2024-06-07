import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { roomHandler } from "./room";

const port = 8080;

const app = express();

app.use(cors);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`A new instance with id: ${socket.id} was created`);

  roomHandler(socket);

  socket.on("disconnect", () => {
    console.log(`instance: ${socket.id} was disconnected`);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
