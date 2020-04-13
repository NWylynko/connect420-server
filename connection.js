const { promisify } = require("util");

const app = require('express')();

const cors = require('cors');
app.use(cors("connect420.web.app"));

const helmet = require('helmet')
app.use(helmet())

const http = require('http').Server(app);
const io = require('socket.io')(http);

const REDISCONFIG = require("./redis.config")
const redis = require('socket.io-redis')
io.adapter(redis(REDISCONFIG))

let port = 3001;

http.listen(port, () => {
  console.log('listening on', port)
});

io.closeAsync = promisify(io.close).bind(io)

exports.io = io
exports.app = app