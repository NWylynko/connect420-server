import redis from "redis";
let client: redis.RedisClient = redis.createClient(process.env.REDIS_URL || 'redis://localhost:6379')
 
client.monitor((err, res) => {
  console.log("Entering monitoring mode.");
});
 
client.on("monitor", (time, args, rawReply) => {
  console.log(time + ": " + args);
});