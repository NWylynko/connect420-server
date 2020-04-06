const { Game } = require("./Game");
const app = require('express')();
const cors = require('cors');
app.use(cors("connect420.web.app"));
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3001;

games = {}

io.on("connection", socket => {
  console.log("connection", socket.id)

  socket.emit("connect", {foo: "bar"})

  socket.on("room", room => {

    if (room) {
      if (!games[room]) {
        games[room] = new Game(io, room)
      }
      socket.join(room);
      games[room].addPlayer(socket.id)
      console.log(`${socket.id} is connecting to ${room}`)

    } else {
      let uid = new Date().valueOf()
      games[uid] = new Game(io, room)
      socket.emit("room", uid)
      socket.join(uid)
      games[uid].addPlayer(socket.id)
      console.log(`${socket.id} is connecting to ${uid}`)
    }
    
  })

  socket.on('addCoin', ({ y }) => {

    let roomID = getRoom(socket)
    games[roomID].addCoin(socket.id, y)

  });

  socket.on("disconnect", () => {
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