const { createAdapter, RedisStreamsAdapterOptions } = require("@socket.io/redis-streams-adapter");
const { createClient } = require("redis");
const { Server } = require("socket.io");

const redisClient = createClient({
  socket: {
    host: '172.31.32.148',
    port: 6379,
    url: 'redis://172.31.32.148:4000'
  }
})




function run() {
  // Create a Socket.io server and configure it to use the Redis adapter
  // const io = new Server();



  // io.adapter(createAdapter(redisClient));

  // // Create a namespace if needed
  // const nsp = io.of("/");

  // Instantiate the RedisStreamsAdapter
  const adapter = createAdapter(redisClient);
  const server = new Server({
    'adapter': adapter
  })

  // Now, you can call the doPublish method
  // const messageToPublish = "Hello from the publisher!";
  // const clusterMessage = {
  //   room: "/", // Replace with the target room or namespace
  //   packet: {
  //     type: "message",
  //     data: messageToPublish,
  //   },
  // };

  // adapter.doPublish(clusterMessage);

}


redisClient.connect().then(() => {
  run();
}).catch(err => {
  console.log('redis connect error:', err)
})