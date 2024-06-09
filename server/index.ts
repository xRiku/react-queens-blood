import fastify from 'fastify';
import { Server as SocketIOServer } from 'socket.io';

const app = fastify()

const io = new SocketIOServer(app.server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});

let numPlayers = 0;
let playerSkippedTurn = false
const history = [] as {player: string, card: string}[];

io.on('connection', (socket) => {
  console.log('A Player with id', socket.id, 'connected')
  numPlayers++;
  io.to(socket.id).emit('playerConnected', {firstPlayer: numPlayers === 1} );
  socket.on('cardPlaced', (card) => {
    if (playerSkippedTurn) {
      playerSkippedTurn = false
    }
    history.push({player: numPlayers === 1 ? 'playerOne' : 'playerTwo', card });
    io.emit('newTurn')
  })

  socket.on('skip-turn', (data) => {
    if (playerSkippedTurn) {
      io.emit('game-end')
    }
    playerSkippedTurn = true
    io.emit('newTurn', data)
  })

  socket.on('place-card', (data) => {
    history.push(data);
    io.emit('newTurn', data)
  })

  socket.on('history', () => {
    io.to(socket.id).emit('history', history)
  })

  socket.on('disconnect', () => {
    console.log('A Player with id', socket.id, 'disconnected')
    numPlayers--;
  })

  if (numPlayers >= 2) {
    io.emit('gameStart');
  }
  
});


io.listen(4000)

app.get('/', async () => {
  return { hello: 'world' }
})

app.listen({port: 3000, host: '0.0.0.0'}, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})