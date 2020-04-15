const { promisify } = require("util");

const REDISCONFIG = require("./redis.config")
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL ? process.env.REDIS_URL : REDISCONFIG);

client.on("ready", () => {
  console.log('✔️ redis is ready')
})

client.on('connect', () => {
  console.log('✔️ connected to redis');
});

client.on("reconnecting", (delay, attempt) => {
  console.log('♻️ redis is reconnecting', { delay, attempt })
})

client.on("error", (error) => {
  console.log('❗️ redis has an error: ', error)
})

client.on("end", () => {
  console.log('❌ redis has been closed')
})

client.on("warning", (error) => {
  console.log('🚨 redis has a warning: ', warning)
})

client.getAsync = promisify(client.get).bind(client);
client.setAsync = promisify(client.set).bind(client);

client.setJSON = (key, data) => {
  return client.setAsync(key, JSON.stringify(data))
}

client.getJSON = (key) => {
  return client.getAsync(key).then(JSON.parse)
}

client.setBoolean = (key, bool) => {
  return client.setAsync(key, bool ? 'true' : 'false')
}

client.getBoolean = (key) => {
  return client.getAsync(key).then(bool => bool === 'true' ? true : false)
}

client.lrangeAsync = promisify(client.lrange).bind(client);
client.lremAsync = promisify(client.lrem).bind(client)
client.lpopAsync = promisify(client.lpop).bind(client)
client.llenAsync = promisify(client.llen).bind(client)
client.keysAsync = promisify(client.keys).bind(client)
client.quitAsync = promisify(client.quit).bind(client)

module.exports = client