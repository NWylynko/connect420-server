import redis from "../../redis.js";
import { io } from "../../connection.js";
import { clientHash, gameHash } from "../../redisKey.js";
import validator from "validator";
import { SocketIO } from "../ws.js";

export async function handleMessage(
  socket: SocketIO,
  {
    message,
    timestamp,
  }: {
    message: string;
    timestamp: number;
  }
): Promise<string> {
  try {
    const msg = validator.escape(message);
    if (!validator.isEmpty(msg)) {
      const room = await redis.hgetAsync(clientHash(socket.id), "room"); // get room of player
      let from: "player1" | "player2" | "viewer";
      if (room) {
        const player1 = await redis.hgetAsync(gameHash(room), "player1");
        if (socket.id === player1) {
          from = "player1";
        } else {
          const player2 = await redis.hgetAsync(gameHash(room), "player2");
          if (socket.id === player2) {
            from = "player2";
          } else {
            from = "viewer";
          }
        }
        io.to(room).emit("message", { message: msg, timestamp, from });
        return `${room}: ${timestamp}: ${msg}`;
      } else {
        throw new Error("no room");
      }
    } else {
      throw new Error("empty msg");
    }
  } catch (error) {
    throw new Error(`uuid: ${socket.id} ip: ${socket.ip} ${error}`);
  }
}
