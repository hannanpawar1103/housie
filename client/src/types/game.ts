export interface Player {
    name : string,
    socket : string,
    tciket : number[][],
    markedNumbers? : number[]
}

export interface Room {
  roomCode: string;
  players: Player[];
  calledNumbers: number[];
  status: string;
}

export type Pattern = "topline" | "middleline" | "bottomline" | "fullhouse";