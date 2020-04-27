// adapted from https://github.com/bryanbraun/connect-four/blob/c96898cb34621e5ab3697a05e11895f6d4e6e7a2/js/functions.js

export default function isDiagonalWin(board: number[][]): boolean {

  let previousValue = 0
  let tally = 0

  // Test for down-right diagonals across the top.
  for (let x = 0; x <= 6; x++) {
    let xtemp = x;
    let ytemp = 0;

    while (xtemp <= 6 && ytemp <= 6) {
      let currentValue = board[ytemp][xtemp];
      if (currentValue === previousValue && currentValue !== 0) {
        tally += 1;
      } else {
        // Reset the tally if you find a gap.
        tally = 0;
      }
      if (tally === 4 - 1) {
        return true;
      }
      previousValue = currentValue;

      // Shift down-right one diagonal index.
      xtemp++;
      ytemp++;
    }
    // Reset the tally and previous value when changing diagonals.
    tally = 0;
    previousValue = 0;
  }

  // Test for down-left diagonals across the top.
  for (let x = 0; x <= 6; x++) {
    let xtemp = x;
    let ytemp = 0;

    while (0 <= xtemp && ytemp <= 6) {
      let currentValue = board[ytemp][xtemp];
      if (currentValue === previousValue && currentValue !== 0) {
        tally += 1;
      } else {
        // Reset the tally if you find a gap.
        tally = 0;
      }
      if (tally === 4 - 1) {
        return true;
      }
      previousValue = currentValue;

      // Shift down-left one diagonal index.
      xtemp--;
      ytemp++;
    }
    // Reset the tally and previous value when changing diagonals.
    tally = 0;
    previousValue = 0;
  }

  // Test for down-right diagonals down the left side.
  for (let y = 0; y <= 6; y++) {
    let xtemp = 0;
    let ytemp = y;

    while (xtemp <= 6 && ytemp <= 6) {
      let currentValue = board[ytemp][xtemp];
      if (currentValue === previousValue && currentValue !== 0) {
        tally += 1;
      } else {
        // Reset the tally if you find a gap.
        tally = 0;
      }
      if (tally === 4 - 1) {
        return true;
      }
      previousValue = currentValue;

      // Shift down-right one diagonal index.
      xtemp++;
      ytemp++;
    }
    // Reset the tally and previous value when changing diagonals.
    tally = 0;
    previousValue = 0;
  }

  // Test for down-left diagonals down the right side.
  for (let y = 0; y <= 6; y++) {
    let xtemp = 6;
    let ytemp = y;

    while (0 <= xtemp && ytemp <= 6) {
      let currentValue = board[ytemp][xtemp];
      if (currentValue === previousValue && currentValue !== 0) {
        tally += 1;
      } else {
        // Reset the tally if you find a gap.
        tally = 0;
      }
      if (tally === 4 - 1) {
        return true;
      }
      previousValue = currentValue;

      // Shift down-left one diagonal index.
      xtemp--;
      ytemp++;
    }
    // Reset the tally and previous value when changing diagonals.
    tally = 0;
    previousValue = 0;
  }

  // No diagonal wins found. Return false.
  return false;
}