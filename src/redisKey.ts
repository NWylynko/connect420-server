export const gameKey = (room: string, key: string): string => {
  return `game:${room}:${key}`;
};

export const clientKey = (id: string, key: string): string => {
  return `client:${id}:${key}`;
};

export const gameHash = (room: string): string => {
  return `game:${room}`;
};

export const clientHash = (id: string): string => {
  return `client:${id}`;
};
