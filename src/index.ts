import Game from "./Game.js";
import redis from './redis.js';
import { io, app } from './connection.js';
import { gameKey, clientHash, gameHash } from "./redisKey.js";
import validator from 'validator';

// import interfaces
import { Request as IRequest, Response as IResponse } from 'express';
import { Socket as ISocket} from 'socket.io';

console.log('🏃 starting connect420 server || version:', process.env.npm_package_version)
console.log('⏰', Date())

app.get('/version', async (req: IRequest, res: IResponse) => {
  res.json({version: process.env.npm_package_version})
})

app.get('/leaderboard', async (req: IRequest, res: IResponse) => {

  let _leaderboard = await redis.zrevrangeAsync('leaderboard', 0, 9, "WITHSCORES")

  let leaderboard: { id: number, name: string, score: string }[] = []

  for (let i = 0; i < _leaderboard.length; i = i + 2) {
    leaderboard.push({ id: i, name: _leaderboard[i], score: _leaderboard[i + 1] });
  }

  res.json(leaderboard)
})
app.get('/stats', async (req: IRequest, res: IResponse) => {

  try {

    res.json({
      error: null,
      numInLobby: await redis.llenAsync("inLobby"),
      numOfAllClients: await redis.getAsync("numOfAllClients"),
      connectedRightNow: await redis.getAsync("connnectedRightNow"),
      gamesPlayed: await redis.getAsync("gamesPlayed"),
    })

  } catch (error) {

    console.error(error)
    res.json({ error: JSON.stringify(error) })

  }

})

app.get('/games', async (req: IRequest, res: IResponse) => {

  try {

    let ArrayOfClients = await redis.lrangeAsync("clients", 0, -1)

    let clients = await Promise.all(ArrayOfClients.map(async key => {

      try {
        let client = await redis.hgetallAsync(clientHash(key))

        return { key, ...client, error: null }
      } catch (error) {
        console.error(error)
        return { key, error: JSON.stringify(error) }
      }

    }))

    let ArrayOfGames = await redis.lrangeAsync("games", 0, -1)

    let games = await Promise.all(ArrayOfGames.map(async key => {

      try {
        let clients = await redis.lrangeAsync(gameKey(key, 'clients'), 0, -1)
        let game = await redis.hgetallAsync(gameHash(key))

        return { key, ...game, clients, error: null }
      } catch (error) {
        console.error(error)
        return { key, error: JSON.stringify(error) }
      }

    }))

    res.json({
      error: null,
      inLobby: await redis.lrangeAsync("inLobby", 0, -1),
      numOfAllClients: await redis.getAsync("numOfAllClients"),
      connectedRightNow: await redis.getAsync("connnectedRightNow"),
      gamesPlayed: await redis.getAsync("gamesPlayed"),
      ArrayOfGames,
      games,
      ArrayOfClients,
      clients
    })

  } catch (error) {

    console.error(error)
    res.json({ error: JSON.stringify(error) })

  }

})

io.on("connection", async (socket: ISocket) => {
  // ip code modified from https://stackoverflow.com/a/59020843
  const ip = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress.split(":")[3] || "unknown";

  console.log("+", socket.id, ip)

  redis.incr("numOfAllClients")
  redis.incr("connnectedRightNow")

  redis.rpush("clients", socket.id)
  redis.hmsetAsync(clientHash(socket.id), 'ip', ip)

  socket.on("name", async (unsafe_name: string) => {

    try {
      let name = validator.escape(unsafe_name)

      if (
        !(validator.isEmpty(name)) && // cant be empty
        validator.isLength(name, { max: 16 }) // cant be over 16 chars
      ) {
        redis.hmsetAsync(clientHash(socket.id), 'name', name)
      }
    } catch (error) {
      console.warn(socket.id, ip, 'error:\n', error)
    }

  })

  socket.on("room", async (unsafe_room: string) => {

    try {
      let room = validator.escape(unsafe_room)

      if (
        !(validator.isEmpty(room)) && // cant be empty
        validator.isLength(room, { max: 12 }) // cant be over 12 chars
      ) {

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

          let exists = await redis.hgetBoolean(gameHash(room), 'exists')

          if (!exists) {
            redis.hsetBoolean(gameHash(room), 'exists', true)

            redis.rpush("games", room)
          }

          socket.join(room, (err) => { if (err) { console.error } });

          Game.addPlayer(room, socket.id)

          console.log(`-> ${socket.id} is in ${room}`)

        }

      }
    } catch (error) {
      console.warn(socket.id, ip, 'error:\n', error)
    }

  })

  socket.on('addCoin', async ({ y } : { y: number | string }) => {

    try {

      if (validator.isInt(y.toString(), { min: 0, max: 6 })) {

        let room = await redis.hgetAsync(clientHash(socket.id), 'room') // get room of player

        if (room) {
          Game.addCoin(room, socket.id, y)
        }

      }

    } catch (error) {
      console.warn(socket.id, ip, 'error:\n', error)
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

process.on('SIGTERM', async () => {
  try {
    await io.closeAsync()
    await redis.quitAsync()
    console.log('goodbye 👋')
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
});