import { ObjectId } from 'mongodb';
import mongoCollections from '../config/mongoCollections.js';
const items = mongoCollections.items;
import validation from '../utils/validation.js';

export const createItem = async (
  type,
  itemName,
  description,
  category,
  tags,
  lastSeenLocation,
  lostDate,
  sendDate,
  imageUrl,
  uid
) => {
  //   type = validation.checkType(type);
  //   itemName = validation.checkItemName(itemName);
  //   description = validation.checkDescription(description);
  //   category = validation.checkCategory(category);
  //   tags = validation.checkTags(tags);
  //   lastSeenLocation = validation.checkLastSeenLocation(lastSeenLocation);
  //   lostDate = validation.checkLostDate(lostDate);
  //   sendDate = validation.checkSendDate(sendDate);
  //   imageUrl = validation.checkImageUrl(imageUrl);

  const itemCollection = await items();
  const newItem = {
    type,
    itemName,
    description,
    category,
    tags,
    lastSeenLocation,
    lostDate,
    sendDate,
    imageUrl,
    uid,
  };
  const insertInfo = await itemCollection.insertOne(newItem);
  if (!insertInfo.acknowledged) throw 'Could not add item';
  const newId = insertInfo.insertedId;
  const item = await getItemById(newId);
  return item;
};

export const getItemById = async (id) => {
  const itemCollection = await items();
  const item = await itemCollection.findOne({ _id: new ObjectId(id) });
  if (!item) throw 'Item not found';
  return item;
};

export const getAllItems = async () => {
  const itemCollection = await items();
  const itemList = await itemCollection.find({}).toArray();
  return itemList;
};

export const getItemsByUserId = async (uid) => {
  const itemCollection = await items();
  const itemList = await itemCollection.find({ uid }).toArray();
  return itemList;
};
