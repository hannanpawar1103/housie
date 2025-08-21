"use client";

import { useState, useEffect } from "react";
import socket from "utils/socket";
import { Player } from "../types/game";

export default function Page() {
  const [playerName, setPlayerName] = useState<string>("");
  const [roomCode, setRoomCode] = useState<string>("");
  const [myRoomCode, setMyRoomCode] = useState<string>("");
  const [ticket, setTicket] = useState<number[][] | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);

  useEffect(() => {
    socket.on(
      "roomCreated",
      ({
        roomCode,
        ticket,
        players,
      }: {
        roomCode: string;
        ticket: number[][];
        players: Player[];
      }) => {
        setMyRoomCode(roomCode);
        setTicket(ticket);
        setPlayers(players);
      }
    );

    socket.on("playerJoined", (newPlayer: Player) => {
      setPlayers((prev) => [...prev, newPlayer]);
    });

    socket.on("lobbyUpdated", (players: Player[]) => {
      setPlayers(players);
    });

    socket.on(
      "numberCalled",
      ({
        number,
        calledNumbers,
      }: {
        number: number;
        calledNumbers: number[];
      }) => {
        setCalledNumbers(calledNumbers)
      }
    );

    return () => {
      socket.off("roomCreated");
      socket.off("playerJoined");
      socket.off("lobbyUpdated");
      socket.off("numberCalled");
    }
   }, []);

   const createRoom = () => {
    socket.emit('createRoom',{playerName})
   }
   const joinRoom = () => {
    socket.emit('joinRoom',{playerName , roomCode})
   }
   const startGame = () => {
    socket.emit('startGame',{myRoomCode})
   }

  return (
    <>
    <div>
      <h1>housie testing</h1>
      <input type="enter your name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
      <button onClick={createRoom}>create room</button>
      <input
        placeholder="Enter Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
      {myRoomCode && (
        <div>
          <h2>Room: {myRoomCode}</h2>
          <button onClick={startGame}>Start Game</button>

          <h3>Players:</h3>
          <ul>
            {players.map((p, idx) => (
              <li key={idx}>{p.name}</li>
            ))}
          </ul>

          <h3>My Ticket:</h3>
          <pre>{JSON.stringify(ticket, null, 2)}</pre>

          <h3>Called Numbers:</h3>
          <div>{calledNumbers.join(", ")}</div>
        </div>
      )}
    </div>
    </>
  );
}
