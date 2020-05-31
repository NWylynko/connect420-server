import redis from "../../redis.js";
import { io } from "../../connection.js";
import { clientHash } from "../../redisKey.js";
import validator from "validator";
import { SocketIO } from "../ws.js";
import { getPlayers } from "../../Game.js";
import Filter from 'bad-words';

const filter = new Filter();

export const handleMessage = async (
  socket: SocketIO,
  {
    message,
    timestamp,
  }: {
    message: string;
    timestamp: number;
  }
): Promise<string> => {
  try {
    const msg = validator.escape(message);

    if (validator.isEmpty(msg) || !validator.isLength(msg, { max: 128 })) {
      throw new Error("empty msg or above 128 characters long");
    }

    const room = await redis.hgetAsync(clientHash(socket.id), "room"); // get room of player

    if (!room) throw new Error("no room");

    const { player1, player2 } = await getPlayers(room); // get uuid of players from room
    const name = await redis.hgetAsync(clientHash(socket.id), "name"); // get name of player that sent the message

    const from: "player1" | "player2" | "viewer" =
      socket.id === player1
        ? "player1"
        : socket.id === player2
        ? "player2"
        : "viewer";

    io.to(room).emit("message", { message: filter.clean(msg), timestamp, from, name });
    return `${room}: ${from}: ${msg}`;
  } catch (error) {
    throw new Error(`uuid: ${socket.id} ip: ${socket.ip} ${error}`);
  }
};
