import redis from "redis";
import { redis_config } from "./redis.config.js"
let client: redis.RedisClient;

if (process.env.REDIS_URL) {
  client = redis.createClient(process.env.REDIS_URL)
} else {
  client = redis.createClient(redis_config)
}
 
client.monitor((err, res) => {
  console.log("Entering monitoring mode.");
});
 
client.on("monitor", (time, args, rawReply) => {
  console.log(time + ": " + args);
});