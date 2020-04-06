const { Game } = require("./Game");
const app = require('express')();
const cors = require('cors');
app.use(cors("connect420.web.app"));
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3001;

games = {}
allClients = []

app.get('/games', (req, res) => {
  console.log("games", games)
  res.send({ players: allClients, boards: { ...Object.keys(games).map(key => { return { id: key, players: games[key].clients, player1: games[key].player1, player2: games[key].player2 } }) } })
})

io.on("connection", socket => {
  console.log("connection", socket.id)
  allClients.push(socket.id)

  socket.on("room", room => {

    if (room) {

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
    Object.keys(games).forEach(index => games[index].removePlayer(socket.id))
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