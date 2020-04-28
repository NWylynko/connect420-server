import isHorizontalWin from "./isHorizontalWin";

describe('isHorizontalWin', () => {
  it('should be a win 1', () => {

    const board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 2, 0, 0],
      [0, 0, 1, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 2, 0, 0, 1, 0],
    ]

    expect(isHorizontalWin(board)).toStrictEqual({"win": true, "winners": [[1, 4], [2, 4], [3, 4], [4, 4]]})
  })

  it('should be a win 2', () => {

    const board = [
      [1, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0],
    ]

    expect(isHorizontalWin(board)).toStrictEqual({"win": true, "winners": [[2, 2], [3, 2], [4, 2], [5, 2]]})
  })

  it('should be a win 3', () => {

    const board = [
      [1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]

    expect(isHorizontalWin(board)).toStrictEqual({"win": true, "winners": [[0, 0], [1, 0], [2, 0], [3, 0]]})
  })

  it('should be a win 4', () => {

    const board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 2, 2, 2, 2, 0],
      [0, 1, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]

    expect(isHorizontalWin(board)).toStrictEqual({"win": true, "winners": [[2, 3], [3, 3], [4, 3], [5, 3]]})
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

    expect(isHorizontalWin(board)).toStrictEqual({"win": false, "winners": []})
  })

  it('should be a loss', () => {

    const board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 1, 2, 1, 1, 0, 0],
      [0, 0, 0, 2, 0, 0, 0],
      [0, 0, 0, 0, 2, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]

    expect(isHorizontalWin(board)).toStrictEqual({"win": false, "winners": []})
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

    expect(isHorizontalWin(board)).toStrictEqual({"win": false, "winners": []})
  })
})