export function gameKey(room, key) {
  return `game:${room}:${key}`;
}

export function clientKey(id, key) {
  return `client:${id}:${key}`;
}

export function gameHash(room) {
  return `game:${room}`;
}

export function clientHash(id) {
  return `client:${id}`;
}
