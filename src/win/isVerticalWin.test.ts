import isVerticalWin from "./isVerticalWin";

describe("isVerticalWin", () => {
  it("should be a win", () => {
    const board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 3, 0, 0, 0],
      [0, 0, 0, 3, 2, 0, 0],
      [0, 0, 1, 3, 0, 0, 0],
      [0, 1, 1, 3, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 2, 0, 0, 1, 0],
    ];

    expect(isVerticalWin(board)).toStrictEqual({
      win: true,
      winners: [
        [3, 1],
        [3, 2],
        [3, 3],
        [3, 4],
      ],
    });
  });

  it("should be a win", () => {
    const board = [
      [1, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 2, 0, 0],
      [0, 0, 1, 1, 2, 1, 0],
      [0, 0, 0, 1, 2, 0, 0],
      [0, 0, 0, 0, 2, 0, 0],
      [0, 0, 2, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0],
    ];

    expect(isVerticalWin(board)).toStrictEqual({
      win: true,
      winners: [
        [4, 1],
        [4, 2],
        [4, 3],
        [4, 4],
      ],
    });
  });

  it("should be a win", () => {
    const board = [
      [1, 2, 1, 1, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 1],
      [0, 2, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];

    expect(isVerticalWin(board)).toStrictEqual({
      win: true,
      winners: [
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
      ],
    });
  });

  it("should be a win", () => {
    const board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 2, 2, 2, 1, 0],
      [0, 1, 0, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1, 0],
    ];

    expect(isVerticalWin(board)).toStrictEqual({
      win: true,
      winners: [
        [5, 3],
        [5, 4],
        [5, 5],
        [5, 6],
      ],
    });
  });

  it("should be a loss (empty board)", () => {
    const board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];

    expect(isVerticalWin(board)).toStrictEqual({ win: false, winners: [] });
  });

  it("should be a loss", () => {
    const board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0],
      [0, 1, 2, 1, 1, 0, 0],
      [0, 0, 0, 2, 0, 0, 0],
      [0, 0, 0, 2, 2, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];

    expect(isVerticalWin(board)).toStrictEqual({ win: false, winners: [] });
  });

  it("should be a loss", () => {
    const board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 2, 0, 0],
      [0, 0, 2, 0, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];

    expect(isVerticalWin(board)).toStrictEqual({ win: false, winners: [] });
  });
});
