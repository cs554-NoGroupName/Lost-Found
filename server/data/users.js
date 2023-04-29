import { ObjectId } from 'mongodb';
import mongoCollections from '../config/mongoCollections.js';
const users = mongoCollections.users;
import validation from '../utils/validation.js';

export const createUser = async (
  firstName,
  lastName,
  email,
  phone,
  dob,
  gender,
  user_firebase_id
) => {
  firstName = validation.checkNames(firstName, 'firstName');
  lastName = validation.checkNames(lastName, 'lastName');
  email = validation.checkEmail(email);
  phone = validation.checkPhone(phone);
  dob = validation.checkDate(dob);
  gender = validation.checkGender(gender);

  const userCollection = await users();
  const newUser = {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    user_firebase_id,
  };
  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged) throw 'Could not add user';
  const newId = insertInfo.insertedId;
  const user = await getUserById(newId);
  return user;
};

export const getUserById = async (id) => {
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: new ObjectId(id) });
  if (!user) throw 'User not found';
  return user;
};

export const getUserByFirebaseId = async (user_firebase_id) => {
  const userCollection = await users();
  const user = await userCollection.findOne({ user_firebase_id });
  if (!user) throw 'User not found';
  return user;
};

export const getAllUsers = async () => {
  const userCollection = await users();
  const userList = await userCollection.find({}).toArray();
  return userList;
};

export const updateUserByFirebaseId = async (
  user_firebase_id,
  firstName,
  lastName,
  email,
  phone,
  dob,
  gender
) => {
  const userCollection = await users();
  const updatedUser = {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
  };
  const updatedInfo = await userCollection.updateOne(
    { user_firebase_id: user_firebase_id },
    { $set: updatedUser }
  );
  if (updatedInfo.modifiedCount === 0 && updatedInfo.matchedCount !== 0) {
    throw 'No changes are made';
  } else if (updatedInfo.modifiedCount === 0) {
    throw 'Could not update user';
  }
  return await getUserByFirebaseId(user_firebase_id);
};

export const deleteUserByFirebaseId = async (user_firebase_id) => {
  const userCollection = await users();
  const deletionInfo = await userCollection.deleteOne({
    user_firebase_id: user_firebase_id,
  });
  if (deletionInfo.deletedCount === 0) {
    throw 'Could not delete user';
  }
  return { deleted: true };
};

export const deleteUserById = async (id) => {
  id = validation.checkObjectId(id, 'id');
  const userCollection = await users();
  const deletionInfo = await userCollection.deleteOne({ _id: ObjectId(id) });
  if (deletionInfo.deletedCount === 0) {
    throw 'Could not delete user';
  }
  return { deleted: true };
};

export default {
  createUser,
  getUserById,
  getUserByFirebaseId,
  getAllUsers,
  updateUserByFirebaseId,
  deleteUserByFirebaseId,
  deleteUserById,
};
