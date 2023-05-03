import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { configRoutes } from './routes/index.js';
import { VerifyToken } from './middleware/VerifyToken.js';

const app = express();
const port = process.env.NODE_PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/images', express.static('images'));
console.log(VerifyToken);
app.use('protected/', VerifyToken);

configRoutes(app);

app.listen(port, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on ' + process.env.SERVER_URL);
});

export default app;
