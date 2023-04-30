import { v4 as uuidv4 } from 'uuid';
import users from '../data/users.js';
import validation from '../utils/validation.js';
import auth from '../config/firebase-config.js';

export async function register(req, res) {
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
}

export async function getUser(req, res) {
  try {
    if (req.user) {
      const user = await users.getUserByFirebaseId(req.user.uid);
      res.json(user);
    }
  } catch (e) {
    res.status(400).json({ error: e });
  }
}
