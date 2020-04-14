const { gameKey, clientKey } = require("./redisKey");
const { isVerticalWin } = require("./isVerticalWin");
const { isHorizontalWin } = require("./isHorizontalWin");
const { isDiagonalWin } = require("./isDiagonalWin");
const { isGameADraw } = require("./isGameADraw");
const { generateBoard } = require("./generateBoard");

async function addPlayer(redis, io, room, id) {

  redis.rpush(gameKey(room, 'clients'), id) // add socket.id to the array of clients
  redis.setAsync(clientKey(id, 'room'), room) // set the clients room to the room id

  let { player1, player2 } = await getPlayers(redis, room) // could and will be null

  if (!player1) {
    redis.setAsync(gameKey(room, 'player1'), id) // set player1 to socket.id
    redis.setAsync(gameKey(room, 'current_player'), id) // set current_player to socket.id
  }
  else if (!player2) {
    redis.setAsync(gameKey(room, 'player2'), id) // set player to socket.id

    start(redis, io, room); // two players have joined
  }
  else { // if a third client joins they are just going to watch
    io.to(id).emit("status", 3);
    io.to(id).emit("info", { type: 'viewer' });
    let board = await redis.getJSON(gameKey(room, 'board'))
    io.to(id).emit("board", board);
  }
}

async function removePlayer(redis, io, id) {

  let room = await redis.getAsync(clientKey(id, 'room')) // get room of player

  deleteClientData(redis, id)

  if (room) { // user wont be in a room when they disconnect from the lobby to join a room

    redis.lremAsync(gameKey(room, 'clients'), 1, id) // remove player from game clients

    let clients = await redis.lrangeAsync(gameKey(room, 'clients'), 0, -1) // get clients remaining

    if (clients.length === 0) {
      deleteGameData(redis, room)
    } else {

      let { player1, player2 } = await getPlayers(redis, room)
      let isRunning = await redis.getBoolean(gameKey(room, 'running'))

      if (id === player1 || id === player2) {
        if (isRunning) {
          io.to(room).emit("status", 8);
        }
        deleteGameData(redis, room)
      }
    }

  }

}

async function deleteClientData(redis, id) {
  redis.del([
    clientKey(id, 'room')
  ])
}

async function deleteGameData(redis, room) {
  redis.del([
    gameKey(room, 'player1'),
    gameKey(room, 'player2'),
    gameKey(room, 'current_player'),
    gameKey(room, 'board'),
    gameKey(room, 'running'),
    gameKey(room, 'clients'),
    gameKey(room, 'exists')
  ])
  redis.lremAsync("games", 1, room)
}

async function start(redis, io, room) {

  redis.setJSON(gameKey(room, 'board'), generateBoard(7, 7)) // generate a new board

  redis.setBoolean(gameKey(room, 'running'), true) // set running to true

  let { player1, player2 } = await getPlayers(redis, room)

  // tell players if they are player1 or player2
  io.to(player1).emit("info", { type: 'player1' });
  io.to(player2).emit("info", { type: 'player2' });

  // set there status's respectively
  io.to(player1).emit("status", 1);
  io.to(player2).emit("status", 2);

  let board = await redis.getJSON(gameKey(room, 'board'))
  io.to(room).emit("board", board);

}

async function addCoin(redis, io, room, id, y) {

  let isRunning = await redis.getBoolean(gameKey(room, 'running'))

  if (isRunning) {

    let { player1, player2 } = await getPlayers(redis, room)
    let current_player = await redis.getAsync(gameKey(room, 'current_player'))

    let isPlayer = id === player1 || id === player2;
    let isThereCurrentTurn = current_player === id;

    if (isPlayer && isThereCurrentTurn) {

      let placed = false;

      let board = await redis.getJSON(gameKey(room, 'board'))

      for (let TryX = 6; TryX >= 0; TryX--) {
        if (board[TryX][y] === 0) {
          board[TryX][y] = id === player1 ? 1 : 2;
          placed = true;
          io.to(room).emit("board", board);
          redis.setJSON(gameKey(room, 'board'), board) // update board
          TryX = 0; // exit out of loop
        }
      }

      if (isHorizontalWin(board) || isDiagonalWin(board) || isVerticalWin(board)) {
        win(redis, io, room, player1, player2, current_player);
      } else if (isGameADraw(board)) {
        win(redis, io, room, player1, player2, current_player, true);
      } else if (placed) {
        io.to(current_player).emit("status", 4);

        let new_player = id === player1 ? player2 : player1

        redis.setAsync(gameKey(room, 'current_player'), new_player);

        io.to(new_player).emit("status", 1);
      }

    }
  }
}

async function win(redis, io, room, player1, player2, current_player, draw) {

  redis.setBoolean(gameKey(room, 'running'), false) // set running to false

  redis.incr("gamesPlayed") // add 1 to number of games played

  if (draw) {
    // tell room the game is a draw
    io.to(room).emit("status", 5);

  } else {
    let Winner = current_player
    let Loser = current_player === player1 ? player2 : player1;

    io.to(Winner).emit("status", 6);
    io.to(Loser).emit("status", 7);
  }

}

async function getPlayers(redis, room) {
  let player1 = await getPlayer1(redis, room)
  let player2 = await getPlayer2(redis, room)

  return { player1, player2 }
}

async function getPlayer1(redis, room) {
  return await redis.getAsync(gameKey(room, 'player1'))
}

async function getPlayer2(redis, room) {
  return await redis.getAsync(gameKey(room, 'player2'))
}

exports.addPlayer = addPlayer;
exports.removePlayer = removePlayer;
exports.addCoin = addCoin;