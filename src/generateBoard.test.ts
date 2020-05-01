import generateBoard, { convertToBoard } from "./generateBoard";

describe('generateBoard', () => {
  it('should return an emtpy board', () => {

    const board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]

    expect(generateBoard(7, 7)).toStrictEqual(board)
  })

})

describe('convertToBoard', () => {
  it('should return an board with a verticle win', () => {

    const board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]

    const points = [[3, 1], [3, 2], [3, 3], [3, 4]]

    expect(convertToBoard(7, 7, points)).toStrictEqual(board)
  })


})