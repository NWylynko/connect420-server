const { gameKey, clientKey, clientHash, gameHash } = require("./redisKey");
const { isVerticalWin } = require("./isVerticalWin");
const { isHorizontalWin } = require("./isHorizontalWin");
const { isDiagonalWin } = require("./isDiagonalWin");
const { isGameADraw } = require("./isGameADraw");
const { generateBoard } = require("./generateBoard");

const redis = require('./redis');
const { io } = require('./connection');

async function addPlayer(room, id) {

  redis.rpush(gameKey(room, 'clients'), id) // add socket.id to the array of clients
  redis.hmsetAsync(clientHash(id), 'room', room) // set the clients room to the room id

  let { player1, player2 } = await getPlayers(room) // could and will be null

  if (!player1) {
    redis.hmsetAsync(gameHash(room), 'player1', id) // set player1 to socket.id
    redis.hmsetAsync(gameHash(room), 'current_player', id) // set current_player to socket.id
  }
  else if (!player2) {
    redis.hmsetAsync(gameHash(room), 'player2', id) // set player to socket.id

    start(room); // two players have joined
  }
  else { // if a third client joins they are just going to watch
    io.to(id).emit("status", 3);
    io.to(id).emit("info", { type: 'viewer' });
    let board = await redis.hgetJSON(gameHash(room), 'board')
    io.to(id).emit("board", board);
  }
}

async function removePlayer(id) {

  let room = await redis.hgetAsync(clientHash(id), 'room') // get room of player

  deleteClientData(id)

  if (room) { // user wont be in a room when they disconnect from the lobby to join a room

    redis.lremAsync(gameKey(room, 'clients'), 1, id) // remove player from game clients

    let clients = await redis.lrangeAsync(gameKey(room, 'clients'), 0, -1) // get clients remaining

    if (clients.length === 0) {
      deleteGameData(room)
    } else {

      let { player1, player2 } = await getPlayers(room)
      let isRunning = await redis.hgetBoolean(gameHash(room), 'running')

      if (id === player1 || id === player2) {
        if (isRunning) {
          io.to(room).emit("status", 8);
        }
        deleteGameData(room)
      }
    }

  }

}

async function deleteClientData(id) {
  redis.del(clientHash(id))
}

async function deleteGameData(room) {
  redis.del([
    gameKey(room, 'clients'),
    gameHash(room)
  ])
  redis.lremAsync("games", 1, room)
}

async function start(room) {

  redis.hsetJSON(gameHash(room), 'board', generateBoard(7, 7)) // generate a new board

  redis.hsetBoolean(gameHash(room), 'running', true) // set running to true

  let { player1, player2 } = await getPlayers(room)

  // tell players if they are player1 or player2
  io.to(player1).emit("info", { type: 'player1' });
  io.to(player2).emit("info", { type: 'player2' });

  // set there status's respectively
  io.to(player1).emit("status", 1);
  io.to(player2).emit("status", 2);

  let board = await redis.hgetJSON(gameHash(room), 'board')
  io.to(room).emit("board", board);

}

async function addCoin(room, id, y) {

  let isRunning = await redis.hgetBoolean(gameHash(room), 'running')

  if (isRunning) {

    let { player1, player2 } = await getPlayers(room)
    let current_player = await redis.hgetAsync(gameHash(room), 'current_player')

    let isPlayer = id === player1 || id === player2;
    let isThereCurrentTurn = current_player === id;

    if (isPlayer && isThereCurrentTurn) {

      let placed = false;

      let board = await redis.hgetJSON(gameHash(room), 'board')

      for (let TryX = 6; TryX >= 0; TryX--) {
        if (board[TryX][y] === 0) {
          board[TryX][y] = id === player1 ? 1 : 2;
          placed = true;
          io.to(room).emit("board", board);
          redis.hsetJSON(gameHash(room), 'board', board) // update board
          TryX = 0; // exit out of loop
        }
      }

      if (isHorizontalWin(board) || isDiagonalWin(board) || isVerticalWin(board)) {
        win(room, player1, player2, current_player);
      } else if (isGameADraw(board)) {
        win(room, player1, player2, current_player, true);
      } else if (placed) {
        io.to(current_player).emit("status", 4);

        let new_player = id === player1 ? player2 : player1

        redis.hmsetAsync(gameHash(room), 'current_player', new_player);

        io.to(new_player).emit("status", 1);
      }

    }
  }
}

async function win(room, player1, player2, current_player, draw) {

  redis.hsetBoolean(gameHash(room), 'running', false) // set running to false

  redis.incr("gamesPlayed") // add 1 to number of games played

  if (draw) {
    // tell room the game is a draw
    io.to(room).emit("status", 5);

  } else {
    let Winner = current_player
    let Loser = current_player === player1 ? player2 : player1;

    io.to(Winner).emit("status", 6);
    io.to(Loser).emit("status", 7);

    let WinnerName = await redis.hgetAsync(clientHash(Winner), 'name')

    if (WinnerName) {
      redis.zincrbyAsync("leaderboard", 1, WinnerName)
    }
    
  }

}

async function getPlayers(room) {
  let player1 = await getPlayer1(room)
  let player2 = await getPlayer2(room)

  return { player1, player2 }
}

async function getPlayer1(room) {
  return await redis.hgetAsync(gameHash(room), 'player1')
}

async function getPlayer2(room) {
  return await redis.hgetAsync(gameHash(room), 'player2')
}

exports.addPlayer = addPlayer;
exports.removePlayer = removePlayer;
exports.addCoin = addCoin;