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
  }, []);

  return (
    <>
      <h1>Hello, Next.js!</h1>
    </>
  );
}
