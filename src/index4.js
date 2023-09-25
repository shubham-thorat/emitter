const { createClient } = require("redis");
const { Server } = require("socket.io");
const { createAdapter, RedisStreamsAdapterOptions } = require("@socket.io/redis-streams-adapter");

const redisClient = createClient({
  socket: {
    host: '172.31.32.148',
    port: 6379,
    url: 'redis://172.31.32.148:4000'
  }
})


function run() {
  const io = new Server({
    adapter: createAdapter(redisClient, {
      streamName: 'socket.io'
    })
  });

  io._checkNamespace('socket.io', {}, (args) => {
    console.log('args namespace', args)
  })

  // const adp = io.adapter()




  io.listen(4000, () => {
    console.log('listening to port 4000')
  });


  // setInterval(() => {
  //   console.log('emting event')
  io.emit('auth_complete', 'OK')
  // }, 1000);
}


redisClient.connect().then(response => {
  console.log('Connected to redis')
  run()
}).catch(ex => {
  console.log('Error while connecting to redis server', ex)
})