function gameKey(room, key) {
  return `game:${room}:${key}`;
}

function clientKey(id, key) {
  return `client:${id}:${key}`;
}

function gameHash(room) {
  return `game:${room}`;
}

function clientHash(id) {
  return `client:${id}`;
}

exports.gameKey = gameKey;
exports.clientKey = clientKey
exports.gameHash = gameHash;
exports.clientHash = clientHash
