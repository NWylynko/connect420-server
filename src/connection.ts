import * as dotenv from "dotenv"; dotenv.config();
import { promisify } from "util";
import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet'
import { createServer, Server} from 'http';
import * as socketIo from 'socket.io';
import * as redis from 'socket.io-redis'

interface ISocketIOAsync extends SocketIO.Server {
  closeAsync?: () => Promise<void>;
}

export const app: express.Application = express()
app.use(cors({ origin: process.env.CORS }));
app.use(helmet())

const server: Server = createServer(app);
export const io: ISocketIOAsync = socketIo(server);

io.adapter(redis(process.env.REDIS_URL || 'redis://localhost:6379'))

let port: string | number = process.env.PORT || 3001;

server.listen(port, () => {
  console.log('👂 listening on', port)
});

io.closeAsync = promisify(io.close).bind(io)