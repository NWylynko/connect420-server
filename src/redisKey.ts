export function gameKey(room: string, key: string): string {
  return `game:${room}:${key}`;
}

export function clientKey(id: string, key: string): string {
  return `client:${id}:${key}`;
}

export function gameHash(room: string): string {
  return `game:${room}`;
}

export function clientHash(id: string): string {
  return `client:${id}`;
}
