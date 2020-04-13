function gameKey(room, key) {
  return `game:${room}:${key}`;
}

function clientKey(id, key) {
  return `client:${id}:${key}`;
}

exports.gameKey = gameKey;
exports.clientKey = clientKey
