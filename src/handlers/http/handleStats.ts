import { Request as IRequest, Response as IResponse } from "express";
import redis from "../../redis.js";

export const handleStats = async (
  req: IRequest,
  res: IResponse
): Promise<string> => {
  try {
    res.json({
      connectedRightNow: await redis.getAsync("connectedRightNow"),
      error: null,
      numInLobby: await redis.llenAsync("inLobby"),
      numOfAllClients: await redis.getAsync("numOfAllClients"),
      gamesPlayed: await redis.getAsync("gamesPlayed"),
    });
    return "Good";
  } catch (error) {
    res.json({ error: JSON.stringify(error) });
    throw new Error(error);
  }
};
