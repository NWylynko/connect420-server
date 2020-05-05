import sourceMapSupport from "source-map-support";
sourceMapSupport.install();
import log from "./logger.js";
const startTime = Date.now();
import { NODE_ENV, VERSION } from "./env.js";
import redis from "./redis.js";
import { io, app } from "./connection.js";

// import interfaces
import { Request as IRequest, Response as IResponse } from "express";
import { Socket as ISocket } from "socket.io";

import httpHandlers from "./handlers/http.js";
import { handleConnection } from "./handlers/ws.js";

log.info(
  `🏃 starting connect420 server || version: ${VERSION} in ${NODE_ENV} mode`
);
log.info(`⏰ ${Date()}`);

app.get("/version", (req: IRequest, res: IResponse) =>
  log.watch("http /version", () => httpHandlers.handleVersion(req, res))
);
app.get("/leaderboard", (req: IRequest, res: IResponse) =>
  log.watch("http /leaderboard", () => httpHandlers.handleLeaderBoard(req, res))
);
app.get("/stats", (req: IRequest, res: IResponse) =>
  log.watch("http /stats", () => httpHandlers.handleStats(req, res))
);
app.get("/games", (req: IRequest, res: IResponse) =>
  log.watch("http /games", () => httpHandlers.handleGames(req, res))
);

io.on("connection", (socket: ISocket) =>
  log.watch("ws new Connection", () => handleConnection(socket))
);

process.on("SIGTERM", async () => {
  try {
    log.info("goodbye 👋 closing connections");
    await io.closeAsync();
    await redis.quitAsync();
    log.success(`✨ Done in ${(Date.now() - startTime) / 1000}s`);
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
});
