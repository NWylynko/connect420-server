import Game from "../../Game.js";
import redis from "../../redis.js";
import { io } from "../../connection.js";
import { gameHash } from "../../redisKey.js";
import validator from "validator";
import { SocketIO } from "../ws.js";

export async function handleRoom(
  socket: SocketIO,
  unsafeRoom: string
): Promise<string> {
  try {
    const room = validator.escape(unsafeRoom);
    if (
      !validator.isEmpty(room) && // cant be empty
      validator.isLength(room, { max: 12 }) // cant be over 12 chars
    ) {
      if (room === "findingAGame") {
        socket.emit("status", 9);
        redis.rpush("inLobby", socket.id);
        const lenOfLobby = await redis.llenAsync("inLobby");
        if (lenOfLobby >= 2) {
          const room = Math.random().toString(36).substr(2, 5);
          const player1 = await redis.lpopAsync("inLobby");
          io.to(player1).emit("setRoom", room);
          const player2 = await redis.lpopAsync("inLobby");
          io.to(player2).emit("setRoom", room);
          return `findingAGame redirecting to board ${room}`;
        } else {
          return `findingAGame waiting for other player`;
        }
      } else if (room) {
        const exists = await redis.hgetBoolean(gameHash(room), "exists");
        if (!exists) {
          redis.hsetBoolean(gameHash(room), "exists", true);
          redis.rpush("games", room);
        }
        socket.join(room, (error) => {
          if (error) {
            throw new Error(error);
          }
        });
        Game.addPlayer(room, socket.id);
        return `-> ${socket.id} is in ${room}`;
      }
      throw new Error("room is undefined");
    }
    throw new Error("didnt pass validation");
  } catch (error) {
    throw new Error(`uuid: ${socket.id} ip: ${socket.ip} ${error}`);
  }
}
