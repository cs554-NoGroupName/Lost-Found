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
  user_firebase_id,
  image_url
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
    image_url,
    reported: [],
    bookmarked: [],
    claimed: [],
  };
  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged) throw 'Could not add user';
  const newId = insertInfo.insertedId;
  const user = await getUserById(newId);
  return user;
};

export const userMinDetails = async (uid) => {
  const userCollection = await mongoCollections.users();
  let user = await userCollection.findOne({
    user_firebase_id: uid,
  });
  user = {
    uid: user.user_firebase_id,
    firstName: user.firstName,
    lastName: user.lastName,
    image_url: user.image_url,
  };
  return user;
};

export const itemMinDetails = async (id) => {
  const itemCollection = await mongoCollections.items();
  let item = await itemCollection.findOne({
    _id: new ObjectId(id),
  });
  item = {
    id: item._id,
    itemName: item.itemName,
    imageUrl: item.imageUrl,
    uid: item.uid,
    itemStatus: item.itemStatus,
  };
  return item;
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
  // fetch reported items
  const itemCollection = await mongoCollections.items();
  const reportedItems = await itemCollection
    .find({ uid: user_firebase_id })
    .toArray();
  user.reported = reportedItems;
  //  fetch requested_claimed items
  if (!user.requested_claims) user.requested_claims = [];
  for (let i = 0; i < user.requested_claims.length; i++) {
    const item = await itemMinDetails(user.requested_claims[i]);
    user.requested_claims[i] = item;
  }
  // received_claimed items
  if (!user.received_claims) user.received_claims = [];
  for (let i = 0; i < user.received_claims.length; i++) {
    const item = await itemMinDetails(user.received_claims[i]);
    user.received_claims[i] = item;
  }

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
  phone,
  dob,
  gender
) => {
  const userCollection = await users();
  const updatedUser = {
    firstName,
    lastName,
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

export const updateUserImage = async (user_firebase_id, image_url) => {
  const userCollection = await users();
  const updatedUser = {
    image_url,
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

export default {
  createUser,
  getUserById,
  getUserByFirebaseId,
  getAllUsers,
  updateUserByFirebaseId,
  deleteUserByFirebaseId,
  deleteUserById,
  updateUserImage,
};
