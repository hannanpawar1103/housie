import { Server } from "socket.io";
import { handleJoinRooms } from "../controllers/room.controller.js";
import { ApiError } from "../utils/ApiError.js";

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

      rooms[roomCode].intervalId = setInterval(() => {
        const nextNumber = rooms[roomCode].remainingNumbers.shift();
        rooms[roomCode].calledNumbers.push(nextNumber);
        console.log(nextNumber);
        io.to(roomCode).emit("numberCalled", {
          number: nextNumber,
          calledNumbers: rooms[roomCode].calledNumbers,
        });
        if (rooms[roomCode].remainingNumbers.length === 0) {
          clearInterval(rooms[roomCode].intervalId);
          console.log("all numbers are called");
          io.to(roomCode).emit("gameEnded");
        }
      }, 10000);
    });

    socket.on("markNumber", ({ roomCode, playerName, number }) => {
      const room = rooms[roomCode];

      if (!room) {
        throw new ApiError(500, "Room does not exist");
      }

      const player = room.player.find((user) => (user.name = playerName));

      if (!player) {
        throw new ApiError(500, "Room does not exist");
      }

      if (!player.markedNumbers) {
        player.markedNumbers = [];
      }

      if (!player.markedNumbers.includes(number)) {
        player.markedNumbers.push(number);
      }

      socket.emit("numberMarked", {
        number,
        markedNumbers: player.markedNumbers,
      });
    });
  });
};
