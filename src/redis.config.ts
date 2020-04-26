// settings for redis connection
// options at https://redis.js.org/#-api-rediscreateclient and https://www.npmjs.com/package/redis#options-object-properties

import { SocketIORedisOptions } from "socket.io-redis"
import { ClientOpts } from "redis"

const host: string = "127.0.0.1"
const port: number = 6379;
const path: string = null;
const url: string = null;
const auth_pass: string = "test";
const family: string = 'IPv4';
const prefix: string = null;

export const redis_config: ClientOpts = {
  host,
  port,
  path,
  url,
  auth_pass,
  family,
  prefix,
}

export const redis_socketio_config: SocketIORedisOptions = {
  host,
  port,
  auth_pass,
}