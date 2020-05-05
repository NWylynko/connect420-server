import { gameKey, clientHash, gameHash } from "./redisKey.js";
import isWin from "./win/isWin.js";
import generateBoard, { convertToBoard } from "./generateBoard.js";

import redis from "./redis.js";
import { io } from "./connection.js";

export async function addPlayer(room: string, id: string): Promise<void> {
  redis.rpush(gameKey(room, "clients"), id); // add socket.id to the array of clients
  redis.hmsetAsync(clientHash(id), "room", room); // set the clients room to the room id

  const { player1, player2 } = await getPlayers(room); // could and will be null

  if (!player1) {
    redis.hmsetAsync(gameHash(room), "player1", id); // set player1 to socket.id
    redis.hmsetAsync(gameHash(room), "current_player", id); // set current_player to socket.id
  } else if (!player2) {
    redis.hmsetAsync(gameHash(room), "player2", id); // set player to socket.id

    start(room); // two players have joined
  } else {
    // if a third client joins they are just going to watch
    io.to(id).emit("status", 3);
    io.to(id).emit("info", { type: "viewer" });
    const board = await redis.hgetJSON(gameHash(room), "board");
    io.to(id).emit("board", board);
  }
}

export async function removePlayer(id: string): Promise<void> {
  const room = await redis.hgetAsync(clientHash(id), "room"); // get room of player

  deleteClientData(id);

  if (room) {
    // user wont be in a room when they disconnect from the lobby to join a room

    redis.lremAsync(gameKey(room, "clients"), 1, id); // remove player from game clients

    const clients = await redis.lrangeAsync(gameKey(room, "clients"), 0, -1); // get clients remaining

    if (clients.length === 0) {
      deleteGameData(room);
    } else {
      const { player1, player2 } = await getPlayers(room);
      const isRunning = await redis.hgetBoolean(gameHash(room), "running");

      if (id === player1 || id === player2) {
        if (isRunning) {
          io.to(room).emit("status", 8);
        }
        deleteGameData(room);
      }
    }
  }
}

async function deleteClientData(id: string): Promise<boolean> {
  redis.del(clientHash(id));
  return true;
}

async function deleteGameData(room: string): Promise<boolean> {
  redis.del([gameKey(room, "clients"), gameHash(room)]);
  redis.lremAsync("games", 1, room);
  return true;
}

async function start(room: string): Promise<void> {
  redis.hsetJSON(gameHash(room), "board", generateBoard(7, 7)); // generate a new board

  redis.hsetBoolean(gameHash(room), "running", true); // set running to true

  const { player1, player2 } = await getPlayers(room);

  // tell players if they are player1 or player2
  io.to(player1).emit("info", { type: "player1" });
  io.to(player2).emit("info", { type: "player2" });

  // set there status's respectively
  io.to(player1).emit("status", 1);
  io.to(player2).emit("status", 2);

  const board = await redis.hgetJSON(gameHash(room), "board");
  io.to(room).emit("board", board);
}

export async function addCoin(
  room: string,
  id: string,
  y: string | number
): Promise<void> {
  const isRunning = await redis.hgetBoolean(gameHash(room), "running");

  if (isRunning) {
    const { player1, player2 } = await getPlayers(room);
    const currentPlayer = await redis.hgetAsync(
      gameHash(room),
      "current_player"
    );

    const isPlayer = id === player1 || id === player2;
    const isThereCurrentTurn = currentPlayer === id;

    if (isPlayer && isThereCurrentTurn) {
      let placed = false;

      const board: number[][] = await redis.hgetJSON(gameHash(room), "board");

      for (let TryX = 6; TryX >= 0; TryX--) {
        if (board[TryX][y] === 0) {
          board[TryX][y] = id === player1 ? 1 : 2;
          placed = true;
          io.to(room).emit("board", board);
          redis.hsetJSON(gameHash(room), "board", board); // update board
          TryX = 0; // exit out of loop
        }
      }

      const gameState = isWin(board);

      if (gameState.win) {
        if (gameState.draw) {
          win(room, player1, player2, currentPlayer, true);
        } else {
          // console.log(gameState.winners);
          io.to(room).emit(
            "highlights",
            convertToBoard(7, 7, gameState.winners)
          );
          win(room, player1, player2, currentPlayer);
        }
      } else if (placed) {
        io.to(currentPlayer).emit("status", 4);

        const newPlayer = id === player1 ? player2 : player1;

        redis.hmsetAsync(gameHash(room), "current_player", newPlayer);

        io.to(newPlayer).emit("status", 1);
      } else {
        // console.error("not a win state and no token placed");
      }
    }
  }
}

async function win(
  room: string,
  player1: string,
  player2: string,
  currentPlayer: string,
  draw?: boolean
): Promise<void> {
  redis.hsetBoolean(gameHash(room), "running", false); // set running to false

  redis.incr("gamesPlayed"); // add 1 to number of games played

  if (draw) {
    // tell room the game is a draw
    io.to(room).emit("status", 5);
  } else {
    const Winner = currentPlayer;
    const Loser = currentPlayer === player1 ? player2 : player1;

    io.to(Winner).emit("status", 6);
    io.to(Loser).emit("status", 7);

    const WinnerName = await redis.hgetAsync(clientHash(Winner), "name");

    if (WinnerName) {
      redis.zincrbyAsync("leaderboard", 1, WinnerName);
    }
  }
}

async function getPlayers(
  room: string
): Promise<{ player1: string; player2: string }> {
  const player1 = await getPlayer1(room);
  const player2 = await getPlayer2(room);

  return { player1, player2 };
}

async function getPlayer1(room: string): Promise<string> {
  return await redis.hgetAsync(gameHash(room), "player1");
}

async function getPlayer2(room: string): Promise<string> {
  return await redis.hgetAsync(gameHash(room), "player2");
}

const Game = { addPlayer, removePlayer, addCoin };

export default Game;
