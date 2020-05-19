interface Status {
  error: number;
  yourTurn: number;
  othersTurn: number;
  fullGame: number;
  greatPlay: number;
  draw: number;
  win: number;
  lost: number;
  playerLeft: number;
  looking: number;
  connecting: number;
  waiting: number;
  notConnected: number;
}

const status: Status = {
  error: 0,
  yourTurn: 1,
  othersTurn: 2,
  fullGame: 3,
  greatPlay: 4,
  draw: 5,
  win: 6,
  lost: 7,
  playerLeft: 8,
  looking: 9,
  connecting: 10,
  waiting: 11,
  notConnected: 12,
};

export default status;
