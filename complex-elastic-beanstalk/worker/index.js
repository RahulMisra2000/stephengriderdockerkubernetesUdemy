const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {                         // ********* writing the event handler foe when something is written to redis
  redisClient.hset('values', message, fib(parseInt(message)));    // **** writing something back to redis
});
sub.subscribe('insert');                                          // ********  we are subscribing to the insert event raised by redis
