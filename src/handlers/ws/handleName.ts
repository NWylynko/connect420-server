import redis from "../../redis.js";
import { clientHash } from "../../redisKey.js";
import validator from "validator";
import { SocketIO } from "../ws.js";

export async function handleName(
  socket: SocketIO,
  unsafeName: string
): Promise<string> {
  try {
    const name = validator.escape(unsafeName);
    if (
      !validator.isEmpty(name) && // cant be empty
      validator.isLength(name, { max: 16 }) // cant be over 16 chars
    ) {
      redis.hmsetAsync(clientHash(socket.id), "name", name);
      return `${socket.id} is ${name}`;
    } else {
      throw new Error("didnt pass validation");
    }
  } catch (error) {
    throw new Error(`uuid: ${socket.id} ip: ${socket.ip} ${error}`);
  }
}
