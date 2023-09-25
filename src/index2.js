// const { Emitter } = require("@socket.io/redis-emitter");
// const { createAdapter } = require("@socket.io/redis-streams-adapter")
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

// const redisClient = new Redis({
//   host: "172.31.32.148",
//   port: "6379"
// });

// const io = new Emitter(redisClient);

let schemaMessage = {
  // 'type': "price_change",
  // 'requestId': v4(),
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
  'opts': {
    rooms: ['room1'],
    except: [],
    flags: false,
  }
};

function run() {
  // const rooms = getRooms(1);
  // console.log('rooms : ', rooms)

  // let messageId = 1;

  const messageFiringRate = 1000;
  const minutes = 5;

  const intervalId = setInterval(() => {
    // console.log('keys is being added to stream socket.io')
    // redisClient.xAdd('socket.io', "*", 'key', JSON.stringify(schemaMessage)).then(id => {
    //   console.log('id : ', id)
    // });

    redisClient.xAdd('mystream', '*', {
      'type': '3',
      'uid': v4(),
      'nsp': '/',
      'diff': 'true',
      'data': JSON.stringify(schemaMessage)
    }, {
      //return true if key is not present
      // 'NOMKSTREAM': true,
    }).then(id => {
      console.log(`Key added to stream with socketId: ${id}`)
    }).catch(error => {
      console.log(`Error while adding keys to stream : ${error}`)
    });

    // redisClient.xadd('socket.io', '*', 'key', JSON.stringify(schemaMessage))

    // redisClient.xAdd('socket.io', '*', schemaMessage).

    // const adapter = createAdapter(redisClient);
    // console.log('adapter', adapter)
    // const _adapter = adapter({
    //   name: '/'
    // })

    // _adapter.doPublish(schemaMessage)

    // redisClient.xAdd('socket.io', '*', {
    //   'key2': 'value',
    //   'key3': 'value2'
    // }).then(id => {
    //   console.log('id : ', id)
    // });
    // const adapter = createAdapter(redisClient, {
    //   'streamName': 'socket.io'
    // })
    // const message = {
    //   'uid': parseInt(Math.random() * 100),
    //   'nsp': '/',
    //   'value': "HELLO WORLD"
    // }



    // adapter({
    //   name: '/'
    // }).doPublish(message)

    // redisClient.xAdd('socket.io', "*", RedisStreamsAdapter.encode(message), {
    //   TRIM: {
    //     strategy: "MAXLEN",
    //     strategyModifier: "~",
    //     threshold: this.#opts.maxLen,
    //   },
    // });
  }, messageFiringRate);

  setTimeout(() => {
    clearInterval(intervalId);
    console.log('All messaged emitted!');
    process.exit(0);
  }, minutes * 60 * 1000);

  // for (const room of rooms) {
  //     let check = io.to(room).emit('price_change', schemaMessage);
  //     console.log('message fired')
  // }
}

// run()
redisClient.connect().then(() => {
  run();
}).catch(err => {
  console.log('redis connect error:', err)
})

