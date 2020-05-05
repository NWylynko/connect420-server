import log from "./logger.js";
import { CORS, REDIS_URL, PORT, CORS_ALLOW_UNKNOWN_ORIGIN } from "./env.js";
import { promisify } from "util";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer, Server } from "http";
import socketIo from "socket.io";
import redis from "socket.io-redis";

interface SocketIOAsync extends SocketIO.Server {
  closeAsync?: () => Promise<void>;
}

export const app: express.Application = express();

const whitelist: string[] = JSON.parse(CORS || '["http://localhost:3000"]');
const corsOptions: cors.CorsOptions = {
  origin: function (
    origin: string,
    callback: (err: Error, allow?: boolean) => void
  ) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else if (CORS_ALLOW_UNKNOWN_ORIGIN === "true" && origin === undefined) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(helmet());

const server: Server = createServer(app);
export const io: SocketIOAsync = socketIo(server);

io.adapter(redis(REDIS_URL || "redis://localhost:6379"));

const port: string | number = PORT || 3001;

server.listen(port, () => {
  log.success(`👂 listening on ${port}`);
});

io.closeAsync = promisify(io.close).bind(io);
