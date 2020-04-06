const { isVerticalWin } = require("./isVerticalWin");
const { isHorizontalWin } = require("./isHorizontalWin");
const { isDiagonalWin } = require("./isDiagonalWin");
const { isGameADraw } = require("./isGameADraw");
const { generateBoard } = require("./generateBoard");

class Game {
  constructor(io, room) {
    this.board = generateBoard(7, 7);
    ;
    this.player1;
    this.player2;
    this.currentPlayer;
    this.room = room;
    this.io = io.to(room);
    this.running = false;
  }

  addPlayer(id) {
    if (!this.player1) {
      this.player1 = id;
      this.current_player = this.player1;
    }
    else if (!this.player2) {
      this.player2 = id;
      this.start(); // two players have join
    }
    else {
      this.io.to(id).emit("status", "Game is full, your a Viewer");
      this.io.to(id).emit("board", this.board);
    }
  }

  start() {
    this.running = true;

    this.io.to(this.player1).emit("status", "Its Your Turn!");
    this.io.to(this.player2).emit("status", "Other Players Turn!");

    this.io.emit("board", this.board);

    setInterval(() => {
      let numOfClients = Object.keys(this.io.connected).length;

      if (numOfClients === 0) {
        delete games[this.room];
      }
    }, 10000);

  }

  addCoin(id, y) {
    if (this.running) {

      console.log(id, y);

      let isPlayer = id === this.player1 || id === this.player2;
      let isThereCurrentTurn = this.current_player === id;

      if (isPlayer && isThereCurrentTurn) {

        let placed = false;

        for (let TryX = 6; TryX >= 0; TryX--) {
          if (this.board[TryX][y] === 0) {
            this.board[TryX][y] = id === this.player1 ? 1 : 2;
            placed = true;
            TryX = 0; // exit out of loop
          }
        }

        if (isHorizontalWin(this.board)) {
          this.win();
        } else if (isDiagonalWin(this.board)) {
          this.win();
        } else if (isVerticalWin(this.board)) {
          this.win();
        } else if (isGameADraw(this.board)) {
          this.win(true);
        } else if (placed) {
          this.io.to(this.current_player).emit("status", "Great Play!");
          this.current_player = id === this.player1 ? this.player2 : this.player1;
          this.io.to(this.current_player).emit("status", "Its Your Turn!");
        }

        this.io.emit("board", this.board);
      }
    }
  }

  win(draw) {
    this.running = false;

    if (draw) {
      this.io.emit("status", "Games a Draw!");
    } else {
      let Winner = this.current_player === this.player1 ? this.player1 : this.player2;
      let Loser = this.current_player === this.player1 ? this.player2 : this.player1;
      
      this.io.to(Winner).emit("status", "You Win!!");
      this.io.to(Loser).emit("status", "You Lost :(");
    }
    
  }

}
exports.Game = Game;
