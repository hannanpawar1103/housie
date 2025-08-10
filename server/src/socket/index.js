import { Server } from "socket.io";
import { handleJoinRooms } from "../controllers/room.controller.js";
import { patternChecker } from "../utils/patternChecker.js";

import rooms from "../utils/rooms.js";

const initSocket = (server) => {
  const io = new Server(server, {
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
      // console.log(numbers);

      if (!rooms[roomCode]) {
        socket.emit("invalidClaim", { message: "Room does not exist" });
        return;
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
        socket.emit("invalidClaim", { message: "Room does not exist" });
        return;
      }

      const player = room.players.find((user) => user.name === playerName);

      if (!player) {
        socket.emit("invalidClaim", { message: "User does not exist" });
        return;
      }

      if (!player.markedNumbers) {
        player.markedNumbers = [];
      }

      const flatTicket = player.ticket.flat();
      if (!flatTicket.includes(number)) {
        socket.emit("invalidClaim", { message: "Number not in ticket" });
        return;
      }

      if (!room.calledNumbers.includes(number)) {
        socket.emit("invalidClaim", { message: "Number not called yet" });
        return;
      }

      if (player.markedNumbers && player.markedNumbers.includes(number)) {
        socket.emit("invalidClaim", { message: "Number already marked" });
        return;
      }

      if (!player.markedNumbers) player.markedNumbers = [];

      player.markedNumbers.push(number);

      socket.emit("numberMarked", {
        number,
        markedNumbers: player.markedNumbers,
      });
    });

    socket.on("claimWin", ({ roomCode, playerName, pattern }) => {
      const room = rooms[roomCode];

      if (!room) {
        socket.emit("invalidClaim", { message: "Room does not exist" });
        return;
      }

      const player = room.players.find((user) => user.name === playerName);

      if (!player) {
        socket.emit("invalidClaim", { message: "User does not exist" });
        return;
      }

      if (!room.claimedPatterns) {
        room.claimedPatterns = [];
      }

      if (room.claimedPatterns.includes(pattern)) {
        socket.emit("invalidClaim", {
          message: `${pattern} has already been claimed.`,
        });
        return;
      }

      const isValid = patternChecker(
        player.ticket,
        player.markedNumbers,
        pattern
      );

      if (isValid) {
        room.claimedPatterns.push(pattern);

        io.to(roomCode).emit("winClaimed", {
          playerName,
          pattern,
        });
      } else {
        socket.emit("invalidClaim", {
          message: `Invalid claim for pattern: ${pattern}`,
        });
      }
    });
  });
};

export default initSocket
