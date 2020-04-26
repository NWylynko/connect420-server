function generateBoard(_x, _y) {
  let start = [];
  for (let x = 0; x < _x; x++) {
    start.push([]);
    for (let y = 0; y < _y; y++) {
      start[x].push(0);
    }
  }
  return start;
}
exports.generateBoard = generateBoard;
