// const MongoClient = require('mongodb').MongoClient;
import { MongoClient } from 'mongodb';
let _connection = undefined;
let _db = undefined;

export default {
  dbConnection: async () => {
    if (!_connection) {
      _connection = await MongoClient.connect(process.env.DATABASE_URL);
      _db = await _connection.db(process.env.DATABASE_NAME);
    }

    return _db;
  },
  closeConnection: () => {
    _connection.close();
  },
};
