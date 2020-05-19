// adapted from https://github.com/bryanbraun/connect-four/blob/c96898cb34621e5ab3697a05e11895f6d4e6e7a2/js/functions.js

const isGameADraw = (board: number[][]): IsWin => {
  const boardSize = 6;
  for (let y = 0; y <= boardSize; y++) {
    for (let x = 0; x <= boardSize; x++) {
      if (!board[x][y]) {
        return { win: false, winners: [] };
      }
    }
  }
  return { win: true, winners: [], draw: true };
};

export default isGameADraw;
