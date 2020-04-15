const redis = require("redis");
const REDISCONFIG = require("./redis.config")
const client = redis.createClient(process.env.REDIS_URL ? process.env.REDIS_URL : REDISCONFIG);
 
client.monitor((err, res) => {
  console.log("Entering monitoring mode.");
});
 
client.on("monitor", (time, args, rawReply) => {
  console.log(time + ": " + args);
});