import { promisify } from "util";
import express from 'express';
import cors from 'cors';
import helmet from 'helmet'
import { createServer, Server} from 'http';
import socketIo from 'socket.io';
import redis from 'socket.io-redis'

interface ISocketIOAsync extends SocketIO.Server {
  closeAsync?: () => Promise<void>;
}

export const app: express.Application = express()
app.use(cors({ origin: process.env.NODE_ENV === 'production' ? "https://connect420.web.app" : "http://localhost:3000"}));
app.use(helmet())

const server: Server = createServer(app);
export const io: ISocketIOAsync = socketIo(server);

io.adapter(redis(process.env.REDIS_URL || 'redis://localhost:6379'))

let port: string | number = process.env.PORT || 3001;

server.listen(port, () => {
  console.log('👂 listening on', port)
});

io.closeAsync = promisify(io.close).bind(io)