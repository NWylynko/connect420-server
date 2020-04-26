import { promisify } from "util";
import express from 'express';
import cors from 'cors';
import helmet from 'helmet'
import { createServer, Server} from 'http';
import socketIo from 'socket.io';
import { redis_socketio_config } from "./redis.config.js"
import redis from 'socket.io-redis'

interface ISocketIOAsync extends SocketIO.Server {
  closeAsync?: () => Promise<void>;
}

export const app: express.Application = express()
app.use(cors({ origin: "connect420.web.app"}));
app.use(helmet())

const server: Server = createServer(app);
export const io: ISocketIOAsync = socketIo(server);

if (process.env.REDIS_URL) {
  io.adapter(redis(process.env.REDIS_URL))
} else {
  io.adapter(redis(redis_socketio_config))
}

let port: string | number = process.env.PORT || 3001;

server.listen(port, () => {
  console.log('👂 listening on', port)
});

io.closeAsync = promisify(io.close).bind(io)