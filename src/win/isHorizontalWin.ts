// adapted from https://github.com/bryanbraun/connect-four/blob/c96898cb34621e5ab3697a05e11895f6d4e6e7a2/js/functions.js

const isHorizontalWin = (board: number[][]): IsWin => {
  const boardSize = 6;
  const toWin = 4;
  let currentValue = null;
  let previousValue = 0;
  let tally = 0;
  let WinningSet: number[][] = [[0, 0]];
  // Scan each row in series, tallying the length of each series. If a series
  // ever reaches four, return true for a win.
  for (let y = 0; y <= boardSize; y++) {
    for (let x = 0; x <= boardSize; x++) {
      currentValue = board[y][x];
      if (currentValue === previousValue && currentValue !== 0) {
        tally++;
        WinningSet.push([x, y]);
      } else {
        // Reset the tally if you find a gap.
        tally = 0;
        WinningSet = [[x, y]];
      }
      if (tally === toWin - 1) {
        return { win: true, winners: WinningSet };
      }
      previousValue = currentValue;
    }
    // After each row, reset the tally and previous value.
    tally = 0;
    previousValue = 0;
  }
  // No horizontal win was found.
  return { win: false, winners: [] };
};

export default isHorizontalWin;
