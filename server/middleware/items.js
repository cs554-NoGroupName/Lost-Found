import dotenv from 'dotenv';
dotenv.config();
import redis from 'redis';

// const client = redis.createClient({
//   password: process.env.REDIS_PASSWORD,
//   socket: {
//     port: process.env.REDIS_PORT || 6379,
//     host: process.env.REDIS_HOST || 'redis',
//   },
// });

const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  url: `rediss://${process.env.REDIS_HOST}:6380`,
});

client.connect().then(() => {
  console.log('Redis connected');
});

export const getAllItems = async (req, res, next) => {
  let exists = await client.exists('getItem');
  if (exists) {
    console.log('Sending data from redis');
    let getItem = await client.get('getItem');
    // return res.status(200).json({ data: JSON.parse(getItem) });
    res.status(200).json({ data: JSON.parse(getItem) });
  } else next();
};

export const getItemsById = async (req, res, next) => {
  console.log('In get items by Id');
  try {
    let exists = await client.exists(`Item_${req.params.id}`);
    if (exists) {
      console.log('Sending data from redis');
      let getItem = await client.get(`Item_${req.params.id}`);
      // return res.status(200).json({ data: JSON.parse(getItem) });
      res.status(200).json({ data: JSON.parse(getItem) });
    } else next();
  } catch (e) {
    next();
  }
};

// export const updateReportedItem = async (req, res, next) => {
//   let exists = await client.exists(req.params.id);
//   if (exists) {
//     console.log('Sending data from redis');
//     let getItem = await client.get(`Item_{req.params.id}`);
//     // return res.status(200).json({ data: JSON.parse(getItem) });
//     res.status(200).json({ data: JSON.parse(getItem) });
//   } else next();
// };
