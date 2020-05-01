import isVerticalWin from "./isVerticalWin.js";
import isHorizontalWin from "./isHorizontalWin.js";
import isDiagonalWin from "./isDiagonalWin.js";
import isGameADraw from "./isGameADraw.js";

export default function isWin(board: number[][]): IsWin {
  const Draw = isGameADraw(board);
  if (Draw.win) {
    return Draw;
  }

  const Vertical = isVerticalWin(board);
  if (Vertical.win) {
    return Vertical;
  }

  const Horizonta = isHorizontalWin(board);
  if (Horizonta.win) {
    return Horizonta;
  }

  const Diagonal = isDiagonalWin(board);
  if (Diagonal.win) {
    return Diagonal;
  }

  return { win: false, winners: [] };
}
