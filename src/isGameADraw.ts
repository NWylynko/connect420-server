// adapted from https://github.com/bryanbraun/connect-four/blob/c96898cb34621e5ab3697a05e11895f6d4e6e7a2/js/functions.js

export default function isGameADraw(board: number[][]): boolean {
  for (let y = 0; y <= 6; y++) {
    for (let x = 0; x <= 6; x++) {
      if (!board[x][y]) {
        return false;
      }
    }
  }
  return true;
}