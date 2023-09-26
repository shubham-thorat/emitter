// const { Emitter } = require("@socket.io/redis-emitter");
// const { createAdapter } = require("@socket.io/redis-streams-adapter")
// const Redis = require('ioredis');

const { createClient } = require("redis");
const { v4 } = require('uuid')
require('dotenv').config()

const redisClient = createClient({
  socket: {
    host: '172.31.32.148',
    port: 6379,
    url: 'redis://172.31.32.148:6379'
  }
})








function run() {

  const counts = process.env.COUNTS || 100
  for (let i = 0; i < counts; i++) {

    const data3 = {
      'packet': {
        'uid': v4(),
        'data': [
          'room1',
          {
            'open_price': "100",
            'high_price': "120",
            'low_price': "89",
            'close_price': "102",
            'last_trade_price': "95",
            'event_name': "stock",
            'event_desc': "change",
            'event_title': "stock price",
            'event_number': '1',
            'event_number_secondary': '9',
            'timestamp': {
              'counts': counts,
              'emitTime': Date.now(),
              'consumedTime': 0,
              'receivedTime': 0,
              'index': i + 1
            }
          }
        ],
        'type': '2',
        'nsp': '/'
      },
      'opts': {
        'rooms': ['room1'],
        'except': [],
        'flags': {},
      },

    }

    let message = {
      'type': '3',
      'uid': v4(),
      'nsp': '/',
      'data': JSON.stringify(data3)
    }

    redisClient.xAdd('socket.io', '*', message, {}).then(id => {
      console.log(`index: ${i + 1}`)
    }).catch(error => {
      console.log(`Error while adding keys to stream : ${error}`)
    });
  }
}

// run()
redisClient.connect().then(() => {
  run();
  // setInterval(() => {
  //   run()
  // }, 1000);
}).catch(err => {
  console.log('redis connect error:', err)
})

