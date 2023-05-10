import dotenv from 'dotenv';
dotenv.config();
import redis from 'redis';

// const client = redis.createClient({
//   password: process.env.REDIS_PASSWORD,
//   url: `rediss://${process.env.REDIS_HOST}:6380`,
// });

const onRedisError = (err) => {
  console.error(err);
};
const onRedisConnect = () => {
  console.log('Redis connected');
};
const onRedisReconnecting = () => {
  console.log('Redis reconnecting');
};
const onRedisReady = () => {
  console.log('Redis ready!');
};

const getClient = async () => {
  const client = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    url: `rediss://${process.env.REDIS_HOST}:6380`,
  });
  client.on('error', onRedisError);
  client.on('connect', onRedisConnect);
  client.on('reconnecting', onRedisReconnecting);
  client.on('ready', onRedisReady);
  await client.connect();
  return client;
};

export default getClient;
