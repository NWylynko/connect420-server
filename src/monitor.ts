import { REDIS_URL } from "./env.js";
import redis from "redis";
const client: redis.RedisClient = redis.createClient(
  REDIS_URL || "redis://localhost:6379"
);

client.monitor(() => {
  console.log("Entering monitoring mode.");
});

client.on("monitor", (time, args) => {
  console.log(time + ": " + args);
});
