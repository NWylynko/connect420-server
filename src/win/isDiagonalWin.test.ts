import isDiagonalWin from "./isDiagonalWin";

describe('isDiagonalWin', () => {
  it('Test for down-right diagonals down the left side (win) 1', () => {

    const board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0],
    ]

    expect(isDiagonalWin(board)).toStrictEqual({"win": true, "winners": [[2, 3], [3, 4], [4, 5], [5, 6]]})
  })

  it('Test for down-right diagonals down the left side (win) 2', () => {

    const board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0],
      [0, 0, 0, 0, 2, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]

    expect(isDiagonalWin(board)).toStrictEqual({"win": true, "winners": [[1, 2], [2, 3], [3, 4], [4, 5]]})
  })

   it('Test for down-right diagonals across the top (win) 1', () => {

     const board = [
       [1, 0, 0, 0, 0, 0, 0],
       [0, 1, 0, 0, 0, 0, 0],
       [0, 0, 1, 0, 0, 0, 0],
       [0, 0, 0, 1, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
     ]

     expect(isDiagonalWin(board)).toStrictEqual({"win": true, "winners": [[0, 0], [1, 1], [2, 2], [3, 3]]})
   })

   it('Test for down-right diagonals across the top (win) 2', () => {

     const board = [
       [0, 2, 0, 0, 0, 0, 0],
       [0, 0, 2, 0, 0, 0, 0],
       [0, 0, 0, 2, 0, 0, 0],
       [0, 0, 0, 0, 2, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
     ]

     expect(isDiagonalWin(board)).toStrictEqual({"win": true, "winners": [[1, 0], [2, 1], [3, 2], [4, 3]]})
   })

   it('Test for down-left diagonals down the right side (win)', () => {

     const board = [
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 1],
       [0, 0, 0, 0, 0, 1, 0],
       [0, 0, 0, 0, 1, 0, 0],
       [0, 0, 0, 1, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
     ]

     expect(isDiagonalWin(board)).toStrictEqual({"win": true, "winners": [[6, 2], [5, 3], [4, 4], [3, 5]]})
   })

   it('Test for down-left diagonals across the top (win) 1', () => {

     const board = [
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 1, 0, 0, 0],
       [0, 0, 1, 0, 0, 0, 0],
       [0, 1, 0, 0, 0, 0, 0],
       [1, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
     ]

     expect(isDiagonalWin(board)).toStrictEqual({"win": true, "winners": [[3, 2], [2, 3], [1, 4], [0, 5]]})
   })

   it('Test for down-left diagonals across the top (win) 2', () => {

     const board = [
       [0, 0, 0, 2, 0, 0, 0],
       [0, 0, 2, 0, 0, 0, 0],
       [0, 2, 0, 0, 0, 0, 0],
       [2, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
     ]

     expect(isDiagonalWin(board)).toStrictEqual({"win": true, "winners": [[3, 0], [2, 1], [1, 2], [0, 3]]})
   })

   it('Test for down-left diagonals across the top (win) 3', () => {

     const board = [
       [0, 0, 0, 0, 2, 0, 0],
       [0, 0, 0, 2, 0, 0, 0],
       [0, 0, 2, 0, 0, 0, 0],
       [0, 2, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
     ]

     expect(isDiagonalWin(board)).toStrictEqual({"win": true, "winners": [[ 4, 0 ], [3, 1], [2, 2], [1, 3]]})
   })

   it('should be a loss', () => {

     const board = [
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
     ]

     expect(isDiagonalWin(board)).toStrictEqual({"win": false, "winners": []})
   })

   it('should be a loss', () => {

     const board = [
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
       [0, 1, 1, 1, 1, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
     ]

     expect(isDiagonalWin(board)).toStrictEqual({"win": false, "winners": []})
   })

   it('should be a loss', () => {

     const board = [
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 1, 0, 0],
       [0, 0, 0, 0, 1, 0, 0],
       [0, 0, 0, 0, 1, 0, 0],
       [0, 0, 0, 0, 1, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0, 0],
     ]

     expect(isDiagonalWin(board)).toStrictEqual({"win": false, "winners": []})
   })
})