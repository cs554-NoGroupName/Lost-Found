import dotenv from 'dotenv';
dotenv.config();
import getClient from '../utils/redisClient.js';
const client = await getClient();

// export const getAllItems = async (req, res, next) => {
//   let exists = await client.exists('getItem');
//   if (exists) {
//     console.log('Sending data from redis');
//     let getItem = await client.get('getItem');
//     // return res.status(200).json({ data: JSON.parse(getItem) });
//     res.status(200).json({ data: JSON.parse(getItem) });
//   } else next();
// };

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
