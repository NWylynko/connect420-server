import redis from "../../redis.js";
import { clientHash, gameHash } from "../../redisKey.js";
import validator from "validator";
import { SocketIO } from "../ws.js";
import { getPlayers } from "../../Game.js";
import { io } from "../../connection.js";
import log from "../../logger.js";

export const handleReplay = async (
  socket: SocketIO,
  unsafeReplay: boolean
): Promise<string> => {
  try {
    const replay: string = validator.escape(unsafeReplay.toString());

    if (validator.isEmpty(replay) && !validator.isBoolean(replay)) {
      throw new Error("didnt pass validation");
    }

    const room = await redis.hgetAsync(clientHash(socket.id), "room"); // get room of player
    const { player1, player2 } = await getPlayers(room);

    log.info((socket.id === player1).toString());
    log.info((socket.id === player2).toString());

    if (socket.id === player1) {
      redis.hmsetAsync(gameHash(room), "player1Replay", replay);
      io.to(room).emit("replay", replay);
      await checkForReplay(room);
      return replay
        ? `${socket.id} wants to replay`
        : `${socket.id} doesn't wants to replay`;
    } else if (socket.id === player2) {
      redis.hmsetAsync(gameHash(room), "player2Replay", replay);
      io.to(room).emit("replay", replay);
      await checkForReplay(room);
      return replay
        ? `${socket.id} wants to replay`
        : `${socket.id} doesn't wants to replay`;
    } else {
      throw new Error("is a viewer");
    }
  } catch (error) {
    throw new Error(`uuid: ${socket.id} ip: ${socket.ip} ${error}`);
  }
};

const checkForReplay = async (room: string): Promise<boolean> => {
  log.info("checking replay");
  const player1Replay = await redis.hgetAsync(gameHash(room), "player1Replay");
  const player2Replay = await redis.hgetAsync(gameHash(room), "player2Replay");

  log.info(player1Replay);
  log.info(player2Replay);

  if (player1Replay === "true" && player2Replay === "true") {
    const newRoom: string = Math.random().toString(36).substr(2, 5); // generate random room
    io.to(room).emit("setRoom", newRoom);
    return true;
  }

  return false;
};
