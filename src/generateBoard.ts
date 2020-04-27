export default function generateBoard(_x: number, _y: number): number[][] {
  let board: number[][] = [];
  for (let x = 0; x < _x; x++) {
    board.push([]);
    for (let y = 0; y < _y; y++) {
      board[x].push(0);
    }
  }
  return board;
}
