const express = require('express');
const app = express();
const configRoutes = require('./routes');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const data = require('./data');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/images', express.static('images'));

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
