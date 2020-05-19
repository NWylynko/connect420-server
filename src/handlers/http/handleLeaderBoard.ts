import { Request as IRequest, Response as IResponse } from "express";
import redis from "../../redis.js";

export const handleLeaderBoard = async (
  req: IRequest,
  res: IResponse
): Promise<string> => {
  try {
    const _leaderboard = await redis.zrevrangeAsync(
      "leaderboard",
      0,
      9, // first ten
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
};
