const { Emitter } = require("@socket.io/redis-emitter");
const Redis = require('ioredis');

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

const redisClient = new Redis({
    host: "172.31.32.148",
    port: "6379"
});

const io = new Emitter(redisClient);

const schemaMessage = {
    type: "price_change",
    open_price: "100",
    high_price: "120",
    low_price: "89",
    close_price: "102",
    last_trade_price: "95",
    event_name: "stock",
    event_desc: "change",
    event_title: "stock price",
    event_number: 1,
    event_number_secondary: 2
};

function run() {
    const rooms = getRooms(1);

    let messageId = 1;

    const messageFiringRate = 10;
    const minutes = 5;

    const intervalId = setInterval(() => {
        for (const room of rooms) {
            io.to(room).emit('price_change', schemaMessage);
            ++messageId;
        }
    }, messageFiringRate);

    setTimeout(() => {
        clearInterval(intervalId);
        console.log('All messaged emitted!');
        process.exit(0);
    }, minutes * 60 * 1000);
}

run();

