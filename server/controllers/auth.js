import { v4 as uuidv4 } from 'uuid';
import users from '../data/users.js';
import validation from '../utils/validation.js';
import { auth } from '../config/firebase-config.js';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { app_auth } from '../config/firebase-auth.js';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
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
    let random_image = createAvatar(lorelei, {
      seed: uid,
      dataUri: true,
    });
    const image_uri = await random_image.toDataUri();
    const { user } = await createUserWithEmailAndPassword(
      app_auth,
      email,
      password,
      firstName + ' ' + lastName
    );
    const user_firebase_id = user.uid;
    await sendEmailVerification(app_auth.currentUser);
    const newUser = await users.createUser(
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      user_firebase_id,
      image_uri
    );
    res.status(201).json(newUser);
  } catch (e) {
    res.status(400).json({ message: e });
  }
}

export async function getUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await signInWithEmailAndPassword(app_auth, email, password);
    // check if user is verified
    if (!user.user.emailVerified) {
      return res.status(400).json({ message: 'Email not verified' });
    }
    const user_firebase_id = user.user.uid;
    const user_data = await users.getUserByFirebaseId(user_firebase_id);
    user_data.token = await user.user.getIdToken();

    // create custom token
    // const customToken = await auth.createCustomToken(user_firebase_id);
    // user_data.customToken = customToken;

    res.status(200).json(user_data);
  } catch (e) {
    res.status(400).json({ message: e });
  }
}

export async function forgot(req, res) {
  try {
    let { email } = req.body;
    email = validation.checkEmail(email);
    await sendPasswordResetEmail(app_auth, email);
    res.status(200).json({ message: 'Email sent' });
  } catch (e) {
    res.status(400).json({ message: e });
  }
}
