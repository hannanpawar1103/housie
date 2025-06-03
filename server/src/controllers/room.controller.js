import { ticketGenerator } from "../utils/ticketGenerator.js";
import rooms from "../utils/rooms.js";



const handleCreateRooms = (socket, playerName) => {
  const ticket = ticketGenerator();
  const roomCode = generateRoomCode();

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
};

const handleJoinRooms = (socket, roomCode, playerName) => {
  if (!rooms[roomCode]) {
    socket.emit("roomNotFound");
    return;
  }

  const playerTicket = ticketGenerator();

  const newPlayer = {
    name: playerName,
    socket: socket.id,
    ticket: playerTicket,
    marked: [],
  };

  rooms[roomCode].players.push(newPlayer);

  socket.join(roomCode);

  socket.emit("playerJoined", newPlayer);

  socket.to(roomCode).emit("lobbyUpdated", rooms[roomCode].players);
};

function generateRoomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export { handleCreateRooms, handleJoinRooms };
