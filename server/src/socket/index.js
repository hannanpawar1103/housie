import { Server } from "socket.io";
import { handleJoinRooms } from "../controllers/room.controller.js";
import rooms from "../utils/rooms.js";

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

    socket.on("startGame", (roomCode) => {
      const shuffledNumber = [];
      for (let i = 1; i <= 90; i++) {
        shuffledNumber.push(i);
      }
      // console.log(...shuffledNumber)

      const numbers = [...shuffledNumber]; // make a copy
      for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
      }
      console.log(numbers);

      if (!rooms[roomCode]) {
        rooms[roomCode] = {};
      }

      rooms[roomCode].remainingNumbers = numbers;
      rooms[roomCode].calledNumbers = [];
      rooms[roomCode].intervalId = null;

      let i = 0;
      rooms[roomCode].intervalId = setInterval(() => {
        console.log(numbers[i]);
        i++;
        if (i >= numbers.length) {
          clearInterval(rooms[roomCode].intervalId);
          console.log("all numbers are called");
        }
      }, 10000);
    });
  });
};
