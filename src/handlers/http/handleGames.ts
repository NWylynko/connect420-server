import { Request as IRequest, Response as IResponse } from "express";
import redis from "../../redis.js";
import { gameKey, clientHash, gameHash } from "../../redisKey.js";

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
