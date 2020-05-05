import { Request as IRequest, Response as IResponse } from "express";
import redis from "../../redis.js";

export async function handleStats(
  req: IRequest,
  res: IResponse
): Promise<string> {
  try {
    res.json({
      error: null,
      numInLobby: await redis.llenAsync("inLobby"),
      numOfAllClients: await redis.getAsync("numOfAllClients"),
      connectedRightNow: await redis.getAsync("connnectedRightNow"),
      gamesPlayed: await redis.getAsync("gamesPlayed"),
    });
    return "Good";
  } catch (error) {
    res.json({ error: JSON.stringify(error) });
    throw new Error(error);
  }
}
