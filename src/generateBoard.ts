export default function generateBoard(_x: number, _y: number): number[][] {
  let start: number[][] = [];
  for (let x = 0; x < _x; x++) {
    start.push([]);
    for (let y = 0; y < _y; y++) {
      start[x].push(0);
    }
  }
  return start;
}
