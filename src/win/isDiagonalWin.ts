// adapted from https://github.com/bryanbraun/connect-four/blob/c96898cb34621e5ab3697a05e11895f6d4e6e7a2/js/functions.js

const isDiagonalWin = (board: number[][]): IsWin => {
  const boardSize = 6;
  const toWin = 4;
  let previousValue = 0;
  let tally = 0;

  // Test for down-right diagonals across the top.
  for (let x = 0; x <= boardSize; x++) {
    let xtemp = x;
    let ytemp = 0;
    let WinningSet: number[][] = [[xtemp, ytemp]];

    while (xtemp <= boardSize && ytemp <= boardSize) {
      const currentValue = board[ytemp][xtemp];
      if (currentValue === previousValue && currentValue !== 0) {
        tally++;
        WinningSet.push([xtemp, ytemp]);
      } else {
        // Reset the tally if you find a gap.
        tally = 0;
        WinningSet = [[xtemp, ytemp]];
      }
      if (tally === toWin - 1) {
        return { win: true, winners: WinningSet };
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
  for (let x = 0; x <= boardSize; x++) {
    let xtemp = x;
    let ytemp = 0;
    let WinningSet: number[][] = [[xtemp, ytemp]];

    while (0 <= xtemp && ytemp <= boardSize) {
      const currentValue = board[ytemp][xtemp];

      if (currentValue === previousValue && currentValue !== 0) {
        tally++;
        WinningSet.push([xtemp, ytemp]);
      } else {
        // Reset the tally if you find a gap.
        tally = 0;
        WinningSet = [[xtemp, ytemp]];
      }
      if (tally === toWin - 1) {
        return { win: true, winners: WinningSet };
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
  for (let y = 0; y <= boardSize; y++) {
    let xtemp = 0;
    let ytemp = y;
    let WinningSet: number[][] = [[xtemp, ytemp]];

    while (xtemp <= boardSize && ytemp <= boardSize) {
      const currentValue = board[ytemp][xtemp];
      if (currentValue === previousValue && currentValue !== 0) {
        tally++;
        WinningSet.push([xtemp, ytemp]);
      } else {
        // Reset the tally if you find a gap.
        tally = 0;
        WinningSet = [[xtemp, ytemp]];
      }
      if (tally === toWin - 1) {
        return { win: true, winners: WinningSet };
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
  for (let y = 0; y <= boardSize; y++) {
    let xtemp = boardSize;
    let ytemp = y;
    let WinningSet: number[][] = [[xtemp, ytemp]];

    while (0 <= xtemp && ytemp <= boardSize) {
      const currentValue = board[ytemp][xtemp];
      if (currentValue === previousValue && currentValue !== 0) {
        tally++;
        WinningSet.push([xtemp, ytemp]);
      } else {
        // Reset the tally if you find a gap.
        tally = 0;
        WinningSet = [[xtemp, ytemp]];
      }
      if (tally === toWin - 1) {
        return { win: true, winners: WinningSet };
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
  return { win: false, winners: [] };
};

export default isDiagonalWin;
