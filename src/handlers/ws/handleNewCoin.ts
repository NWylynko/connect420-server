import Game from "../../Game.js";
import redis from "../../redis.js";
import { clientHash } from "../../redisKey.js";
import validator from "validator";
import { SocketIO } from "../ws.js";

export async function handleNewCoin(
  socket: SocketIO,
  {
    y,
  }: {
    y: number | string;
  }
): Promise<string> {
  try {
    if (!validator.isInt(y.toString(), { min: 0, max: 6 }))
      throw new Error("didnt pass validation");

    const room = await redis.hgetAsync(clientHash(socket.id), "room"); // get room of player

    if (!room) throw new Error("room undefined");

    Game.addCoin(room, socket.id, y);
    return `added coin to column ${y}`;
  } catch (error) {
    throw new Error(`uuid: ${socket.id} ip: ${socket.ip} ${error}`);
  }
}
