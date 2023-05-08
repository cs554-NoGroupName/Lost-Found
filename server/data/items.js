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

export const getItemById = async (id) => {
  const itemCollection = await items();
  const item = await itemCollection.findOne({ _id: new ObjectId(id) });
  if (!item) throw 'Item not found';
  // append user details
  const userCollection = await mongoCollections.users();
  const user = await userMinDetails(item.uid);
  item.reportedBy = user;
  // for each userId in claims array append user details
  for (let i = 0; i < item.claims.length; i++) {
    const user = await userMinDetails(item.claims[i].userId);
    item.claims[i].userDetails = user;
  }
  // add item to user's reported array
  const reportedBy = await userCollection.findOne({
    user_firebase_id: item.uid,
  });
  const updatedReportedBy = await userCollection.updateOne(
    { _id: new ObjectId(reportedBy._id) },
    // only update claims array with the new uid
    {
      $addToSet: {
        reported: id,
      },
    }
  );

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

export const updateClaims = async (id, uid) => {
  const itemCollection = await items();
  const item = await itemCollection.findOne({ _id: new ObjectId(id) });
  if (!item) throw 'Item not found';
  if (item.uid === uid) throw 'You cannot claim your own item';
  if (item.itemStatus === 'claimed') throw 'Item already claimed';
  if (item.itemStatus === 'resolved') throw 'Item already resolved';
  const claimObj = {
    userId: uid,
    claimStatus: 'pending',
    claimDate: new Date().toISOString(),
  };

  const updatedInfo = await itemCollection.updateOne(
    { _id: new ObjectId(id) },
    // only update claims array with the new uid
    {
      $addToSet: {
        claims: claimObj,
      },
    }
  );

  if (updatedInfo.modifiedCount === 0) throw 'Could not update item';
  // add item to user's requested_claims array
  const userCollection = await mongoCollections.users();
  const user = await userCollection.findOne({
    user_firebase_id: uid,
  });
  const updatedUser = await userCollection.updateOne(
    { _id: new ObjectId(user._id) },
    // only update claims array with the new uid
    {
      $addToSet: {
        requested_claims: id,
      },
    }
  );

  // added item to user's recived_claims array
  const itemOwner = await userCollection.findOne({
    user_firebase_id: item.uid,
  });
  const updatedItemOwner = await userCollection.updateOne(
    { _id: new ObjectId(itemOwner._id) },
    // only update claims array with the new uid
    {
      $addToSet: {
        received_claims: id,
      },
    }
  );

  // for each userId in claims array append user details
  const claims = await itemCollection.findOne({ _id: new ObjectId(id) });
  for (let i = 0; i < claims.claims.length; i++) {
    const user = await userMinDetails(claims.claims[i].userId);
    claims.claims[i].userDetails = user;
  }
  const reportedBy = await userMinDetails(item.uid);
  item.reportedBy = reportedBy;
  return claims;
};

export const resolveClaimById = async (id, claimId, uid) => {
  const itemCollection = await items();
  const item = await itemCollection.findOne({ _id: new ObjectId(id) });
  if (!item) throw 'Item not found';
  if (item.uid !== uid) throw 'You cannot resolve this item';
  if (item.itemStatus === 'claimed') throw 'Item already resolved';

  const updatedInfo = await itemCollection.updateOne(
    { _id: new ObjectId(id) },
    // only update claims array with the new uid
    {
      $set: {
        itemStatus: 'claimed',
        claimedBy: claimId,
      },
    }
  );

  if (updatedInfo.modifiedCount === 0) throw 'Could not update item';
  // remove item from user's requested_claims array and add to claims array
  const userCollection = await mongoCollections.users();
  const user = await userCollection.findOne({
    user_firebase_id: claimId,
  });
  const updatedUser = await userCollection.updateOne(
    { _id: new ObjectId(user._id) },
    // only update claims array with the new uid
    {
      $pull: {
        requested_claims: id,
      },
      $addToSet: {
        claims: id,
      },
    }
  );

  // also update claim status in item's claims array
  const updatedItem = await itemCollection.updateOne(
    { _id: new ObjectId(id), 'claims.userId': claimId },
    // only update claims array with the new uid
    {
      $set: {
        'claims.$.claimStatus': 'approved',
      },
    }
  );

  // remove item from user's received_claims array
  const itemOwner = await userCollection.findOne({
    user_firebase_id: item.uid,
  });
  const updatedItemOwner = await userCollection.updateOne(
    { _id: new ObjectId(itemOwner._id) },
    // only update claims array with the new uid
    {
      $pull: {
        received_claims: id,
      },
    }
  );

  // for each userId in claims array append user details
  const claims = await itemCollection.findOne({ _id: new ObjectId(id) });
  for (let i = 0; i < claims.claims.length; i++) {
    const user = await userMinDetails(claims.claims[i].userId);
    claims.claims[i].userDetails = user;
  }
  const reportedBy = await userMinDetails(claims.uid);
  claims.reportedBy = reportedBy;
  return claims;
};

export const rejectClaimById = async (id, claimId, uid) => {
  const itemCollection = await items();
  const item = await itemCollection.findOne({ _id: new ObjectId(id) });
  if (!item) throw 'Item not found';
  if (item.uid !== uid) throw 'You cannot reject this item';
  if (item.itemStatus === 'claimed') throw 'Item already resolved';

  // also update claim status in item's claims array
  const updatedItem = await itemCollection.updateOne(
    { _id: new ObjectId(id), 'claims.userId': claimId },
    // only update claims array with the new uid
    {
      $set: {
        'claims.$.claimStatus': 'rejected',
      },
    }
  );

  // for each userId in claims array append user details
  const claims = await itemCollection.findOne({ _id: new ObjectId(id) });
  for (let i = 0; i < claims.claims.length; i++) {
    const user = await userMinDetails(claims.claims[i].userId);
    claims.claims[i].userDetails = user;
  }
  const reportedBy = await userMinDetails(claims.uid);
  claims.reportedBy = reportedBy;
  return claims;
};

export const updateDispute = async (id, uid, dispute) => {
  const itemCollection = await items();
  const item = await itemCollection.findOne({ _id: new ObjectId(id) });
  if (!item) throw 'Item not found';
  if (item.uid !== uid) throw 'You cannot update this item';
  if (item.itemStatus !== 'claimed') throw 'Item not claimed';

  const disputeObj = {
    dispute,
    disputeDate: new Date().toISOString(),
    userId: uid,
    status: 'pending',
  };

  const updatedInfo = await itemCollection.updateOne(
    { _id: new ObjectId(id) },
    // only update claims array with the new uid
    {
      $addToSet: {
        disputes: disputeObj,
      },
    }
  );

  if (updatedInfo.modifiedCount === 0) throw 'Could not update item';
  // for each userId in claims array append user details
  const disputes = await itemCollection.findOne({ _id: new ObjectId(id) });
  for (let i = 0; i < disputes.disputes.length; i++) {
    const user = await userMinDetails(disputes.disputes[i].userId);
    disputes.disputes[i].userDetails = user;
  }
  const reportedBy = await userMinDetails(disputes.uid);
  disputes.reportedBy = reportedBy;
  return disputes;
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
