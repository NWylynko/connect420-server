import isVerticalWin from "./isVerticalWin.js";
import isHorizontalWin from "./isHorizontalWin.js";
import isDiagonalWin from "./isDiagonalWin.js";
import isGameADraw from "./isGameADraw.js";

export default function isWin(board: number[][]): isWin {
  let Draw = isGameADraw(board)
  if (Draw.win) {
    return Draw
  }

  let Vertical = isVerticalWin(board)
  if (Vertical.win) {
    return Vertical
  }

  let Horizonta = isHorizontalWin(board)
  if (Horizonta.win) {
    return Horizonta
  }

  let Diagonal = isDiagonalWin(board)
  if (Diagonal.win) {
    return Diagonal
  }

  return { win: false, winners: [] };
}