const { Game } = require("./Game");
const app = require('express')();
const cors = require('cors');
app.use(cors("connect420.web.app"));
const helmet = require('helmet')
app.use(helmet())
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3001;

games = {}
let numOfAllClients = 0
let connnectedRightNow = 0
var inLobby = []

app.get('/games', (req, res) => {
  res.send({ inLobby, numOfAllClients, connnectedRightNow, boards: { ...Object.keys(games).map(key => { return { id: key, players: games[key].clients, player1: games[key].player1, player2: games[key].player2 } }) } })
})

io.on("connection", socket => {
  console.log("connection", socket.id)
  numOfAllClients += 1
  connnectedRightNow += 1

  socket.on("room", room => {

    if (room === "findingAGame") {
      socket.emit("status", "Looking for a match!")
      inLobby.push(socket.id)

      if (inLobby.length >= 2) {
        let room = Math.random().toString(36).substr(2, 5);
        io.to(inLobby[0]).emit('setRoom', room)
        inLobby.shift()
        io.to(inLobby[0]).emit('setRoom', room)
        inLobby.shift()
      }
    } else if (room) {

      if (!games[room]) {
        games[room] = new Game(io, room)
      }

      socket.join(room, (err) => { if (err) { console.error } });

      games[room].addPlayer(socket.id)

      console.log(`${socket.id} is connecting to ${room}`)

    }

  })

  socket.on('addCoin', ({ y }) => {

    let roomID = getRoom(socket)
    if (games[roomID]) {
      games[roomID].addCoin(socket.id, y)
    }


  });

  socket.on("disconnect", () => {
    connnectedRightNow -= 1
    Object.keys(games).forEach(index => games[index].removePlayer(socket.id))
    if (inLobby.includes(socket.id)) {
      inLobby = arrayRemove(inLobby, socket.id)
    }
    console.log("disconnection", socket.id)
  })
})

http.listen(port, () => {
  console.log('listening on ' + port);
});

function getRoom(socket) {
  let { rooms } = socket
  delete rooms[socket.id]
  return Object.keys(rooms)[0]
}

function arrayRemove(arr, value) {

  // from https://love2dev.com/blog/javascript-remove-from-array/

  return arr.filter(function (ele) {
    return ele != value;
  });
}