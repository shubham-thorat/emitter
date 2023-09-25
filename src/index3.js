const { Emitter } = require("@socket.io/redis-emitter");
const { Server } = require('socket.io')
const { createAdapter } = require("@socket.io/redis-streams-adapter")
// const Redis = require('ioredis');

const { createClient } = require("redis");
const { v4 } = require('uuid')

const redisClient = createClient({
  socket: {
    host: '172.31.32.148',
    port: 6379,
    url: 'redis://172.31.32.148:4000'
  }
})



/**
 * Generates ids of rooms
 * @param N number of rooms
 * @returns array of N rooms with ids := room1, room2, ..., roomN
 */
function getRooms(N) {
  const rooms = [];

  for (let i = 1; i <= N; ++i) {
    const room = `room${i}`;
    rooms.push(room);
  }

  return rooms;
}


let schemaMessage = {
  // 'type': "price_change",
  'requestId': v4(),
  'open_price': "100",
  'high_price': "120",
  'low_price': "89",
  'close_price': "102",
  'last_trade_price': "95",
  'event_name': "stock",
  'event_desc': "change",
  'event_title': "stock price",
  'event_number': '1',
  'event_number_secondary': '2',
  'nsp': '/',
  'type': '3'
};

function run() {
  const messageFiringRate = 1000;
  const minutes = 5;


  const adapter = createAdapter(redisClient, {
    'streamName': 'socket.io'
  })

  const io = new Server({
    'adapter': adapter
  })

  adapter().doPublish({
    'nsp': '/',
    'type': 3,
    'uid': v4(),
    'data': "HELLO"
  })

  io.listen(5000)

  const intervalId = setInterval(() => {

    redisClient.xAdd('mystream', '*', {
      'data': JSON.stringify(schemaMessage)
    }, {
      //return true if key is not present
      // 'NOMKSTREAM': true
    }).then(id => {
      console.log(`Key added to stream with socketId: ${id} `)
    }).catch(error => {
      console.log(`Error while adding keys to stream: ${error} `)
    });

  }, messageFiringRate);

  setTimeout(() => {
    clearInterval(intervalId);
    console.log('All messaged emitted!');
    process.exit(0);
  }, minutes * 60 * 1000);

}

redisClient.connect().then(() => {
  run();
}).catch(err => {
  console.log('redis connect error:', err)
})

