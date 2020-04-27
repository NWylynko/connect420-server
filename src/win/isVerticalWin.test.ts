import isVerticalWin from "./isVerticalWin";

describe('isVerticalWin', () => {
  it('should be a win', () => {

    const board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 0, 0],
      [0, 0, 1, 1, 0, 0, 0],
      [0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 2, 0, 0, 1, 0],
    ]

    expect(isVerticalWin(board)).toBe(true)
  })

  it('should be a win', () => {

    const board = [
      [1, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 2, 0, 0],
      [0, 0, 1, 1, 2, 1, 0],
      [0, 0, 0, 1, 2, 0, 0],
      [0, 0, 0, 0, 2, 0, 0],
      [0, 0, 2, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0],
    ]

    expect(isVerticalWin(board)).toBe(true)
  })

  it('should be a win', () => {

    const board = [
      [1, 2, 1, 1, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 1],
      [0, 2, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]

    expect(isVerticalWin(board)).toBe(true)
  })

  it('should be a win', () => {

    const board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 2, 2, 2, 1, 0],
      [0, 1, 0, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1, 0],
    ]

    expect(isVerticalWin(board)).toBe(true)
  })

  it('should be a loss (empty board)', () => {

    const board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]

    expect(isVerticalWin(board)).toBe(false)
  })

  it('should be a loss', () => {

    const board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0],
      [0, 1, 2, 1, 1, 0, 0],
      [0, 0, 0, 2, 0, 0, 0],
      [0, 0, 0, 2, 2, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]

    expect(isVerticalWin(board)).toBe(false)
  })

  it('should be a loss', () => {

    const board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 2, 0, 0],
      [0, 0, 2, 0, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]

    expect(isVerticalWin(board)).toBe(false)
  })
})