import redis from "../../redis.js";
import { clientHash } from "../../redisKey.js";
import validator from "validator";
import { SocketIO } from "../ws.js";
import Filter from 'bad-words';

const filter = new Filter();

export const handleName = async (
  socket: SocketIO,
  unsafeName: string
): Promise<string> => {
  try {
    const name = validator.escape(unsafeName);

    if (validator.isEmpty(name) || !validator.isLength(name, { max: 16 })) {
      throw new Error("didnt pass validation");
    }

    if (filter.isProfane(name)) {
      throw new Error("name not family friendly");
    }

    redis.hmsetAsync(clientHash(socket.id), "name", name);
    return `${socket.id} is ${name}`;
  } catch (error) {
    throw new Error(`uuid: ${socket.id} ip: ${socket.ip} ${error}`);
  }
};
