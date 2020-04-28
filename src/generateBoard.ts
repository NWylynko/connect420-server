export default function generateBoard(columns: number, rows: number): number[][] {
  let board: number[][] = [];
  for (let x = 0; x < columns; x++) {
    board.push([]);
    for (let y = 0; y < rows; y++) {
      board[x].push(0);
    }
  }
  return board;
} 

export function convertToBoard(columns: number, rows: number, points: number[][]): number[][] {
  let template = generateBoard(columns, rows)

  points.forEach(([x, y]) => {

    template[y][x] = 1
  })

  return template
} 
