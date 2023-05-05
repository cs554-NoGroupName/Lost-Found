import { v4 as uuidv4 } from 'uuid';
import users from '../data/users.js';
import validation from '../utils/validation.js';
import { auth } from '../config/firebase-config.js';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { app_auth } from '../config/firebase-auth.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
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
      user_firebase_id,
      image_uri
    );
    res.status(201).json(newUser);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}

export async function getUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await signInWithEmailAndPassword(app_auth, email, password);
    const user_firebase_id = user.user.uid;
    const user_data = await users.getUserByFirebaseId(user_firebase_id);
    user_data.token = await user.user.getIdToken();
    res.status(200).json(user_data);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}
