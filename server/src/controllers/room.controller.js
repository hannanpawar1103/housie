import { ticketGenerator } from "../utils/ticketGenerator.js";

const rooms = {};

export const handleCreateRooms = (socket, playerName) => {
  const roomCode = generateRoomCode();

  const ticket = ticketGenerator();

  rooms[roomCode] = {
    host: socket.id,
    players: [
      {
        name: playerName,
        socket: socket.id,
        ticket,
        marked: [],
      },
    ],
    calledNumbers: [],
    status: "waiting",
  };

  socket.join(roomCode);

  socket.emit("roomCreated", {
    roomCode,
    ticket,
    players: rooms[roomCode].players,
  });
  console.log(`Room ${roomCode} created by ${playerName}`);

  function generateRoomCode() {
    const chars = "";
    const code = "";
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    console.log("code", code);
  }
};
