import express from 'express';
// create routes for auth using firebase
import firebaseConfig from '../config/firebase-config.js';
import { v4 as uuidv4 } from 'uuid';
import { users } from '../data';
import validation from '../utils/validation.js';
import auth from '../config/firebase-config.js';
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, gender, phone, dob } = req.body;
  try {
    email = validation.checkEmail(email);
    password = validation.checkPassword(password);
    firstName = validation.checkNames(firstName, 'firstName');
    lastName = validation.checkNames(lastName, 'lastName');
    gender = validation.checkGender(gender, 'Gender');
    phone = validation.checkPhone(phone, 'Phone');
    dob = validation.checkDate(dob, 'Date of Birth');
    const user = await auth.createUserWithEmailAndPassword(email, password);
    const user_firebase_id = user.user.uid;
    const newUser = await users.createUser(
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      user_firebase_id
    );
    res.json(newUser);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

export default router;
