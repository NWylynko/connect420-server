// adapted from https://github.com/bryanbraun/connect-four/blob/c96898cb34621e5ab3697a05e11895f6d4e6e7a2/js/functions.js

export default function isVerticalWin(board: number[][]): boolean {
  var currentValue = null, previousValue = 0, tally = 0;
  // Scan each column in series, tallying the length of each series. If a
  // series ever reaches four, return true for a win.
  for (var x = 0; x <= 6; x++) {
    for (var y = 0; y <= 6; y++) {
      currentValue = board[y][x];
      if (currentValue === previousValue && currentValue !== 0) {
        tally += 1;
      }
      else {
        // Reset the tally if you find a gap.
        tally = 0;
      }
      if (tally === 4 - 1) {
        return true;
      }
      previousValue = currentValue;
    }
    // After each column, reset the tally and previous value.
    tally = 0;
    previousValue = 0;
  }
  // No vertical win was found.
  return false;
}