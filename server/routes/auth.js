import express from 'express';
// create routes for auth using firebase
import firebaseConfig from '../config/firebase-config.js';
import { v4 as uuidv4 } from 'uuid';
import users from '../data/users.js';
import validation from '../utils/validation.js';
import auth from '../config/firebase-config.js';
const router = express.Router();

router.post('/register', async (req, res) => {
  let { email, password, firstName, lastName, gender, phone, dob } = req.body;
  try {
    email = validation.checkEmail(email);
    password = validation.checkPassword(password);
    firstName = validation.checkNames(firstName, 'firstName');
    lastName = validation.checkNames(lastName, 'lastName');
    gender = validation.checkGender(gender, 'Gender');
    phone = validation.checkPhone(phone, 'Phone');
    dob = validation.checkDate(dob, 'Date of Birth');
    const uid = uuidv4();
    const user = await auth.createUser({
      uid,
      email,
      password,
      displayName: firstName + ' ' + lastName,
    });
    const user_firebase_id = user.uid;
    const newUser = await users.createUser(
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      user_firebase_id
    );
    res.status(201).json(newUser);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.post('/login', async (req, res) => {
  // idToken comes from the client app
  const idToken = req.headers.authorization.split(' ')[1];
  try {
    const decodeValue = await auth.verifyIdToken(idToken);
    if (decodeValue) {
      const user = await users.getUserByFirebaseId(decodeValue.uid);
      res.json(user);
    }
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

export default router;
