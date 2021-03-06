import log from "./logger.js";
import { CORS, REDIS_URL, PORT, CORS_ALLOW_UNKNOWN_ORIGIN } from "./env.js";
import { promisify } from "util";
import express, { Request as IRequest, Response as IResponse } from "express";
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
  origin: (origin: string, callback: (err: Error, allow?: boolean) => void) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else if (CORS_ALLOW_UNKNOWN_ORIGIN === "true" && origin === undefined) {
      callback(null, true);
    } else {
      callback(new Error(`${origin} - Not allowed by CORS`));
    }
  },
};

const errorHandler = (
  err: Error,
  req: IRequest,
  res: IResponse,
  next: () => void
): void => {
  if (err) {
    const serverError = 500;
    log.error(err.message);
    res.status(serverError);
    res.send(err.message);
  } else {
    next();
  }
};

app.use(cors(corsOptions));
app.use(errorHandler);
app.use(helmet());

const server: Server = createServer(app);
export const io: SocketIOAsync = socketIo(server);

io.adapter(redis(REDIS_URL || "redis://localhost:6379"));

const defaultPort = 3001;
const port: string | number = PORT || defaultPort;

server.listen(port, () => {
  log.success(`👂 listening on ${port}`);
});

io.closeAsync = promisify(io.close).bind(io);
