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
  lastSeenDate,
  imageUrl,
  uid
) => {
  type = validation.checkType(type);
  itemName = validation.checkItemName(itemName);
  description = validation.checkDescription(description);
  category = validation.checkCategory(category);
  tags = validation.checkTags(tags);
  lastSeenLocation = validation.checkLastSeenLocation(lastSeenLocation);
  lastSeenDate = validation.checkLastSeenDate(lastSeenDate);

  const itemCollection = await items();
  const newItem = {
    type,
    itemName,
    description,
    category,
    tags,
    lastSeenLocation,
    lastSeenDate,
    imageUrl,
    uid,
    itemStatus: 'reported',
    claimedBy: '',
    claims: [],
    disputes: [],
    timelineDetails: [],
    comments: [],
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

export const updateItem = async (...args) => {
  let [
    id,
    itemName,
    description,
    lastSeenLocation,
    itemStatus,
    type,
    category,
  ] = args;

  if (
    !itemName &&
    !description &&
    !lastSeenLocation &&
    !itemStatus &&
    !type &&
    !category
  )
    throw 'Should have atleast one parameter';
  id = validation.checkObjectId(id);

  const getItemId = await getItemById(id);

  let updateItem = {};

  if (itemName && getItemId.itemName != itemName) {
    itemName = validation.checkNames(itemName, 'name');
    updateItem.itemName = itemName;
  }
  if (description && getItemId.description != description) {
    description = validation.checkInputString(description, 'description');
    updateItem.description = description;
  }
  if (lastSeenLocation && getItemId.lastSeenLocation != lastSeenLocation) {
    lastSeenLocation = validation.checkInputString(
      lastSeenLocation,
      'lastSeenLocation'
    );
    updateItem.lastSeenLocation = lastSeenLocation;
  }
  if (itemStatus && getItemId.itemStatus != itemStatus) {
    itemStatus = validation.checkInputString(itemStatus, 'status');
    updateItem.itemStatus = itemStatus;
  }
  if (type && getItemId.type != type) {
    type = validation.checkInputString(type, 'type');
    updateItem.type = type;
  }
  if (category && getItemId.category != category) {
    category = validation.checkInputString(category, 'category');
    updateItem.category = category;
  }
  const itemData = await items();
  const updatedInfo = await itemData.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateItem }
  );
  if (updatedInfo.modifiedCount === 0) throw 'Could not update item';

  return await getItemById(id);
};

export const deleteItemById = async (id) => {
  id = validation.checkObjectId(id);
  const getItem = await getItemById(id);
  const itemData = await items();
  const deletionInfo = await itemData.deleteOne({ _id: new ObjectId(id) });
  if (deletionInfo.deletedCount === 0) {
    throw new Error(`Could not delete item with id of ${id}`);
  }
  console.log(deletionInfo);
  return getItem;
};
