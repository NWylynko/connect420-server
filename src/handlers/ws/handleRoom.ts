import Game from "../../Game.js";
import redis from "../../redis.js";
import { io } from "../../connection.js";
import { gameHash } from "../../redisKey.js";
import validator from "validator";
import { SocketIO } from "../ws.js";
import gameStatus from "../../gameStatus.js";

export const handleRoom = async (
  socket: SocketIO,
  unsafeRoom: string
): Promise<string> => {
  try {
    const room = validator.escape(unsafeRoom);
    if (validator.isEmpty(room) || !validator.isLength(room, { max: 12 })) {
      throw new Error("didnt pass validation");
    }
    if (!room) throw new Error("room is undefined");

    if (room === "findingAGame") {
      socket.emit("status", gameStatus.looking);
      redis.rpush("inLobby", socket.id);
      const lenOfLobby = await redis.llenAsync("inLobby");
      if (lenOfLobby >= 2) {
        const room: string = Math.random().toString(36).substr(2, 5); // generate random room
        const player1: string = await redis.lpopAsync("inLobby");
        io.to(player1).emit("setRoom", room);
        const player2: string = await redis.lpopAsync("inLobby");
        io.to(player2).emit("setRoom", room);
        return `findingAGame redirecting to board ${room}`;
      } else {
        return `findingAGame waiting for other player`;
      }
    } else {
      const exists = await redis.hgetBoolean(gameHash(room), "exists");
      if (!exists) {
        redis.hsetBoolean(gameHash(room), "exists", true);
        redis.rpush("games", room);
      }
      socket.join(room, (error: Error) => {
        if (error) {
          throw new Error(error.message);
        }
      });
      await Game.addPlayer(room, socket.id);
      return `-> ${socket.id} is in ${room}`;
    }
  } catch (error) {
    throw new Error(`uuid: ${socket.id} ip: ${socket.ip} ${error}`);
  }
};
