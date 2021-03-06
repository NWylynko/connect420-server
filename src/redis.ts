import log from "./logger.js";
import { REDIS_URL } from "./env.js";
import { promisify } from "util";
import redis from "redis";

interface RedisClientAsync extends redis.RedisClient {
  setBoolean?: (key: string, bool: boolean) => Promise<"OK">;
  getBoolean?: (key: string) => Promise<boolean>;
  hgetAsync?: (hash: string, key: string) => Promise<string>;
  hgetallAsync?: (hash: string) => Promise<{ [key: string]: string }>;
  hmsetAsync?: (hash: string, key: string, data: string) => Promise<"OK">;
  hsetJSON?: (hash: string, key: string, data: object) => Promise<"OK">;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hgetJSON?: (hash: string, key: string) => Promise<any>;
  hsetBoolean?: (hash: string, key: string, bool: boolean) => Promise<"OK">;
  hgetBoolean?: (hash: string, key: string) => Promise<boolean>;
  lrangeAsync?: (key: string, start: number, stop: number) => Promise<string[]>;
  lremAsync?: (key: string, count: number, value: string) => Promise<number>;
  lpopAsync?: (key: string) => Promise<string>;
  llenAsync?: (key: string) => Promise<number>;
  zincrbyAsync?: (
    key: string,
    increment: number,
    member: string
  ) => Promise<string>;
  zrevrangeAsync?: (
    key: string,
    start: number,
    stop: number,
    withscores?: string
  ) => Promise<string[]>;
  keysAsync?: (pattern: string) => Promise<string[]>;
  quitAsync?: () => Promise<"OK">;
  getAsync?: (key: string) => Promise<string>;
  setAsync?: (key: string, data: string) => Promise<"OK">;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getJSON?: (key: string) => Promise<any>;
  setJSON?: (key: string, data: object) => Promise<"OK">;
}

const client: RedisClientAsync = redis.createClient(
  REDIS_URL || "redis://localhost:6379"
);

client.on("ready", () => {
  log.success(`redis is ready`);
});

client.on("connect", () => {
  log.success(`connected to redis`);
});

client.on("reconnecting", (delay: unknown, attempt: unknown) => {
  log.warning(`redis is reconnecting ${delay}, ${attempt}`);
});

client.on("error", (error: unknown) => {
  log.error(`redis has an error: ${error}`);
});

client.on("end", () => {
  log.fail(`redis has been closed`);
});

client.on("warning", (warning: unknown) => {
  log.warning(`redis has a warning: ${warning}`);
});

client.getAsync = promisify(client.get).bind(client);
client.setAsync = promisify(client.set).bind(client);

client.setJSON = (key: string, data: object): Promise<"OK"> => {
  return client.setAsync(key, JSON.stringify(data));
};

client.getJSON = (key: string): Promise<unknown> => {
  return client.getAsync(key).then(JSON.parse);
};

client.setBoolean = (key: string, bool: boolean): Promise<"OK"> => {
  return client.setAsync(key, bool ? "true" : "false");
};

client.getBoolean = (key: string): Promise<boolean> => {
  return client
    .getAsync(key)
    .then((bool: string) => (bool === "true" ? true : false));
};

client.hgetAsync = promisify(client.hget).bind(client);
client.hgetallAsync = promisify(client.hgetall).bind(client);
client.hmsetAsync = promisify(client.hmset).bind(client);

client.hsetJSON = (hash: string, key: string, data: object): Promise<"OK"> => {
  return client.hmsetAsync(hash, key, JSON.stringify(data));
};

client.hgetJSON = (hash: string, key: string): Promise<unknown> => {
  return client.hgetAsync(hash, key).then(JSON.parse);
};

client.hsetBoolean = (
  hash: string,
  key: string,
  bool: boolean
): Promise<"OK"> => {
  return client.hmsetAsync(hash, key, bool ? "true" : "false");
};

client.hgetBoolean = (hash: string, key: string): Promise<boolean> => {
  return client
    .hgetAsync(hash, key)
    .then((bool: string) => (bool === "true" ? true : false));
};

client.lrangeAsync = promisify(client.lrange).bind(client);
client.lremAsync = promisify(client.lrem).bind(client);
client.lpopAsync = promisify(client.lpop).bind(client);
client.llenAsync = promisify(client.llen).bind(client);

client.zincrbyAsync = promisify(client.zincrby).bind(client);
client.zrevrangeAsync = promisify(client.zrevrange).bind(client);

client.keysAsync = promisify(client.keys).bind(client);
client.quitAsync = promisify(client.quit).bind(client);

export default client;
