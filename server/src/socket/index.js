import { Server } from "socket.io";
import { handleJoinRooms } from "../controllers/room.controller.js";

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("socket connected : ", socket.id);

    socket.on("disconnect", () => {
      console.log("socket disconnected : ", socket.id);
    });

    socket.on("joinRoom", ({ roomCode, playerName }) => {
      console.log("room joined successfully", socket.id);
      handleJoinRooms(socket, roomCode, playerName);
    });


  });
};
