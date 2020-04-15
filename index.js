const Game = require("./Game");
const redis = require('./redis');
const { io, app } = require('./connection');
const { gameKey, clientKey } = require("./redisKey");

console.log('🏃 starting connect420 server')
console.log('⏰', Date())

app.get('/games', async (req, res) => {

  try {

    let ArrayOfClients = await redis.lrangeAsync("clients", 0, -1)

    let clients = await Promise.all(ArrayOfClients.map(async key => {

      try {
        let room = await redis.getAsync(clientKey(key, 'room'))
        let ip = await redis.getAsync(clientKey(key, 'ip'))

        return { key, room, ip, error: null }
      } catch (error) {
        console.error(error)
        return { key, error: JSON.stringify(error) }
      }

    }))

    let ArrayOfGames = await redis.lrangeAsync("games", 0, -1)

    let games = await Promise.all(ArrayOfGames.map(async key => {

      try {
        let player1 = await redis.getAsync(gameKey(key, 'player1'))
        let player2 = await redis.getAsync(gameKey(key, 'player2'))
        let current_player = await redis.getAsync(gameKey(key, 'current_player'))
        let board = await redis.getJSON(gameKey(key, 'board'))
        let running = await redis.getBoolean(gameKey(key, 'running'))
        let clients = await redis.lrangeAsync(gameKey(key, 'clients'), 0, -1)
        let exists = await redis.getBoolean(gameKey(key, 'exists'))

        return { key, player1, player2, current_player, board, running, clients, exists, error: null }
      } catch (error) {
        console.error(error)
        return { key, error: JSON.stringify(error) }
      }

    }))

    res.json({
      error: null,
      inLobby: await redis.lrangeAsync("inLobby", 0, -1),
      numOfAllClients: await redis.getAsync("numOfAllClients"),
      connnectedRightNow: await redis.getAsync("connnectedRightNow"),
      gamesPlayed: await redis.getAsync("gamesPlayed"),
      ArrayOfGames,
      games,
      ArrayOfClients,
      clients,
    })

  } catch (error) {

    console.error(error)
    res.json({ error: JSON.stringify(error) })

  }

})

io.on("connection", async socket => {
  // ip code from https://stackoverflow.com/questions/6458083/get-the-clients-ip-address-in-socket-io
  const ip = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress.split(":")[3];

  console.log("+", socket.id, ip)

  redis.incr("numOfAllClients")
  redis.incr("connnectedRightNow")

  redis.rpush("clients", socket.id)
  redis.setAsync(clientKey(socket.id, 'ip'), ip)

  socket.on("room", async room => {

    if (room === "findingAGame") {
      socket.emit("status", 9)
      redis.rpush("inLobby", socket.id)

      let lenOfLobby = await redis.llenAsync("inLobby")

      if (lenOfLobby >= 2) {
        let room = Math.random().toString(36).substr(2, 5);

        let player1 = await redis.lpopAsync("inLobby")
        io.to(player1).emit('setRoom', room)

        let player2 = await redis.lpopAsync("inLobby")
        io.to(player2).emit('setRoom', room)

      }
    } else if (room) {

      let exists = await redis.getBoolean(gameKey(room, 'exists'))

      if (!exists) {
        redis.setBoolean(gameKey(room, 'exists'), true)
        redis.rpush("games", room)
      }

      socket.join(room, (err) => { if (err) { console.error } });

      Game.addPlayer(room, socket.id)

      console.log(`${socket.id} is connecting to ${room}`)

    }

  })

  socket.on('addCoin', async ({ y }) => {

    let room = await redis.getAsync(clientKey(socket.id, 'room')) // get room of player

    if (room) {
      Game.addCoin(room, socket.id, y)
    }


  });

  socket.on("disconnect", async () => {
    redis.decr("connnectedRightNow")

    redis.lremAsync("inLobby", 1, socket.id) // remove id from lobby (they probably arnt in the lobby though)
    redis.lremAsync("clients", 1, socket.id) // remove id from array of clients

    Game.removePlayer(socket.id)

    console.log("-", socket.id, ip)
  })
})

process.on('SIGINT', async () => {
  try {
    await io.closeAsync()
    await redis.quitAsync()
    console.log('goodbye 👋')
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
});