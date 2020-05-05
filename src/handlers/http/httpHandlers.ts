import { NODE_ENV, VERSION } from "../../env.js";
import { Request as IRequest, Response as IResponse } from "express";
import redis from "../../redis.js";
import { gameKey, clientHash, gameHash } from "../../redisKey.js";

export async function handleVersion(
  req: IRequest,
  res: IResponse
): Promise<string> {
  try {
    const response: {
      version: string;
      development?: boolean;
    } = {
      version: VERSION,
    };
    if (NODE_ENV === "development") {
      response.development = true;
    }
    res.json({ error: null, ...response });
    return "Good";
  } catch (error) {
    res.json({ error, version: "???", development: false });
    throw new Error(error);
  }
}

export async function handleLeaderBoard(
  req: IRequest,
  res: IResponse
): Promise<string> {
  try {
    const _leaderboard = await redis.zrevrangeAsync(
      "leaderboard",
      0,
      9,
      "WITHSCORES"
    );
    const leaderboard: {
      id: number;
      name: string;
      score: string;
    }[] = [];
    for (let i = 0; i < _leaderboard.length; i = i + 2) {
      leaderboard.push({
        id: i,
        name: _leaderboard[i],
        score: _leaderboard[i + 1],
      });
    }
    res.json({ error: null, leaderboard });
    return "Good";
  } catch (error) {
    res.json({ error, leaderboard: [] });
    throw new Error(error);
  }
}

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

export async function handleGames(
  req: IRequest,
  res: IResponse
): Promise<string> {
  try {
    const ArrayOfClients = await redis.lrangeAsync("clients", 0, -1);
    const clients = await Promise.all(
      ArrayOfClients.map(async (key) => {
        try {
          const client = await redis.hgetallAsync(clientHash(key));
          return { key, ...client, error: null };
        } catch (error) {
          return { key, error: JSON.stringify(error) };
        }
      })
    );
    const ArrayOfGames = await redis.lrangeAsync("games", 0, -1);
    const games = await Promise.all(
      ArrayOfGames.map(async (key) => {
        try {
          const clients = await redis.lrangeAsync(
            gameKey(key, "clients"),
            0,
            -1
          );
          const game = await redis.hgetallAsync(gameHash(key));
          return { key, ...game, clients, error: null };
        } catch (error) {
          return { key, error: JSON.stringify(error) };
        }
      })
    );
    res.json({
      error: null,
      inLobby: await redis.lrangeAsync("inLobby", 0, -1),
      numOfAllClients: await redis.getAsync("numOfAllClients"),
      connectedRightNow: await redis.getAsync("connnectedRightNow"),
      gamesPlayed: await redis.getAsync("gamesPlayed"),
      ArrayOfGames,
      games,
      ArrayOfClients,
      clients,
    });
    return "Good";
  } catch (error) {
    res.json({ error: JSON.stringify(error) });
    throw new Error(error);
  }
}
