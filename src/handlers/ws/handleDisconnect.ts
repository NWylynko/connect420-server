import Game from "../../Game.js";
import redis from "../../redis.js";
import { SocketIO } from "../ws.js";

export const handleDisconnect = async (socket: SocketIO): Promise<string> => {
  try {
    redis.decr("connnectedRightNow");
    redis.lremAsync("inLobby", 1, socket.id); // remove id from lobby (they probably arnt in the lobby though)
    redis.lremAsync("clients", 1, socket.id); // remove id from array of clients
    Game.removePlayer(socket.id);
    return `uuid: ${socket.id} ip: ${socket.ip}`;
  } catch (error) {
    throw new Error(`uuid: ${socket.id} ip: ${socket.ip} ${error}`);
  }
};
