import redis from "redis";
let client: redis.RedisClient = redis.createClient(process.env.REDIS_URL)
 
client.monitor((err, res) => {
  console.log("Entering monitoring mode.");
});
 
client.on("monitor", (time, args, rawReply) => {
  console.log(time + ": " + args);
});