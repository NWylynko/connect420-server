/**
 *
 * generates a 2d board
 *
 * @export
 * @param {number} columns number of columns (x)
 * @param {number} rows number of rows (y)
 * @returns {number[][]} board[x][y]
 */
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

/**
 *
 * converts an array of points to a heatmap style board where 1 is where the points are and 0 means no point was there
 * 
 * eg convertToBoard(2, 2, [[0,0],[1,1]])
 * 
 * [
 *  [1, 0],
 *  [0, 1]
 * ]
 * 
 * @param {number} columns number of columns on the new board, needs to be more than the max of all x
 * @param {number} rows number of all rows on the new board, needs to be more than the max of all y
 * @param {number[][]} points an array of arrays with the x and y of the point
 * @returns {number[][]} board[x][y]
 */
export function convertToBoard(columns: number, rows: number, points: number[][]): number[][] {
  let template = generateBoard(columns, rows)

  points.forEach(([x, y]) => {

    template[y][x] = 1
  })

  return template
} 
