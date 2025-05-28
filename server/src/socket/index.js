import { Server } from "socket.io";

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("socket connected : ", socket.id);

    socket.on("disconnect", (socket) => {
      console.log("socket disconnected : ", socket.id);
    });
  });
};
