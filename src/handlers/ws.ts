import log from "../logger.js";
import redis from "../redis.js";
import { clientHash } from "../redisKey.js";
import { handleName } from "./ws/handleName.js";
import { handleRoom } from "./ws/handleRoom.js";
import { handleNewCoin } from "./ws/handleNewCoin.js";
import { handleMessage } from "./ws/handleMessage.js";
import { handleDisconnect } from "./ws/handleDisconnect.js";

// import interfaces
import { Socket as ISocket } from "socket.io";

export interface SocketIO extends ISocket {
  ip?: string;
}

export const handleConnection = async (socket: SocketIO): Promise<string> => {
  try {
    // ip code modified from https://stackoverflow.com/a/59020843
    socket.ip =
      socket.handshake.headers["x-forwarded-for"] ||
      socket.conn.remoteAddress.split(":")[3] ||
      "unknown";

    redis.incr("numOfAllClients");
    redis.incr("connnectedRightNow");

    redis.rpush("clients", socket.id);

    redis.hmsetAsync(clientHash(socket.id), "ip", socket.ip);

    socket.on("name", (unsafeName) =>
      log.process("ws name", () => handleName(socket, unsafeName))
    );
    socket.on("room", (unsafeRoom) =>
      log.process("ws room", () => handleRoom(socket, unsafeRoom))
    );
    socket.on("addCoin", ({ y }) =>
      log.process("ws addCoin", () => handleNewCoin(socket, { y }))
    );
    socket.on("message", (msg) =>
      log.process("ws message", () => handleMessage(socket, msg))
    );
    socket.on("disconnect", () =>
      log.process("ws diconnect", () => handleDisconnect(socket))
    );

    return `uuid: ${socket.id} ip: ${socket.ip}`;
  } catch (error) {
    throw new Error(error);
  }
};
