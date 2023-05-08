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
  const userCollection = await mongoCollections.users();
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
    timelineDetails: [
      {
        status: 'reported',
        date: new Date().toISOString(),
        uid,
        userDetails: await userMinDetails(uid),
      },
    ],
    comments: [],
  };
  const insertInfo = await itemCollection.insertOne(newItem);
  if (!insertInfo.acknowledged) throw 'Could not add item';
  const newId = insertInfo.insertedId;
  // add item to user's reported array

  const item = await getItemById(newId);
  const reportedBy = await userCollection.findOne({
    user_firebase_id: item.uid,
  });
  const updatedReportedBy = await userCollection.updateOne(
    { _id: new ObjectId(reportedBy._id) },
    // only update claims array with the new uid
    {
      $addToSet: {
        reported: newId,
      },
    }
  );
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

  return item;
};

export const getAllItems = async () => {
  const itemCollection = await items();
  let itemList = await itemCollection.find({}).toArray();
  let todayDate = new Date();
  let seven = new Date(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    todayDate.getDate() - 7
  );
  let today = itemList.filter((item) => {
    let date = new Date(item.lastSeenDate);
    return (
      date.getDate() === todayDate.getDate() &&
      date.getMonth() === todayDate.getMonth() &&
      date.getFullYear() === todayDate.getFullYear()
    );
  });
  console.log('week');
  let week = itemList.filter((item) => {
    let date = new Date(item.lastSeenDate);

    return (
      date >= seven &&
      !(
        date.getDate() === todayDate.getDate() &&
        date.getMonth() === todayDate.getMonth() &&
        date.getFullYear() === todayDate.getFullYear()
      )
    );
  });

  console.log('beyond');
  let beyond = itemList.filter((item) => {
    let date = new Date(item.lastSeenDate);

    return (
      date < seven &&
      !(
        date.getDate() === todayDate.getDate() &&
        date.getMonth() === todayDate.getMonth() &&
        date.getFullYear() === todayDate.getFullYear()
      )
    );
  });
  return { today: today, week: week, beyond: beyond };
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

  // update timelineDetails
  const timelineObj = {
    status: 'claim request',
    date: new Date().toISOString(),
    uid,
    userDetails: await userMinDetails(uid),
  };
  const updatedTimeline = await itemCollection.updateOne(
    { _id: new ObjectId(id) },
    // only update claims array with the new uid
    {
      $addToSet: {
        timelineDetails: timelineObj,
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
  claims.reportedBy = reportedBy;
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

  // update timelineDetails
  const timelineObj = {
    status: 'claim approved',
    date: new Date().toISOString(),
    uid,
    userDetails: await userMinDetails(uid),
  };
  const updatedTimeline = await itemCollection.updateOne(
    { _id: new ObjectId(id) },
    // only update claims array with the new uid
    {
      $addToSet: {
        timelineDetails: timelineObj,
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

  // update timelineDetails
  const timelineObj = {
    status: 'claim rejected',
    date: new Date().toISOString(),
    uid,
    userDetails: await userMinDetails(uid),
  };
  const updatedTimeline = await itemCollection.updateOne(
    { _id: new ObjectId(id) },
    // only update claims array with the new uid
    {
      $addToSet: {
        timelineDetails: timelineObj,
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
  // delete item from user's reported array
  const userCollection = await mongoCollections.users();
  const reportedBy = await userCollection.findOne({
    user_firebase_id: getItem.uid,
  });
  const updatedReportedBy = await userCollection.updateOne(
    { _id: new ObjectId(reportedBy._id) },
    // only update claims array with the new uid
    {
      $pull: {
        reported: id,
      },
    }
  );
  // delete item from user's requested_claims array
  for (let i = 0; i < getItem.claims.length; i++) {
    const user = await userCollection.findOne({
      user_firebase_id: getItem.claims[i].userId,
    });
    const updatedUser = await userCollection.updateOne(
      { _id: new ObjectId(user._id) },
      // only update claims array with the new uid
      {
        $pull: {
          requested_claims: id,
        },
      }
    );
  }
  // delete item from user's received_claims array
  const itemOwner = await userCollection.findOne({
    user_firebase_id: getItem.uid,
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
  // delete item from user's claims array
  for (let i = 0; i < getItem.claims.length; i++) {
    const user = await userCollection.findOne({
      user_firebase_id: getItem.claims[i].userId,
    });
    const updatedUser = await userCollection.updateOne(
      { _id: new ObjectId(user._id) },
      // only update claims array with the new uid
      {
        $pull: {
          claims: id,
        },
      }
    );
  }

  const deletionInfo = await itemData.deleteOne({ _id: new ObjectId(id) });
  if (deletionInfo.deletedCount === 0) throw 'Could not delete item';

  console.log(deletionInfo);
  return { deleted: true, message: 'Item deleted successfully' };
};

export const addComment = async (id, uid, comment) => {
  id = validation.checkObjectId(id);
  const item = await getItemById(id);
  const userCollection = await mongoCollections.users();
  const user = await userCollection.findOne({
    user_firebase_id: uid,
  });
  const commentObj = {
    _id: new ObjectId(),
    comment,
    commentDate: new Date().toISOString(),
    userId: uid,
    userDetails: {
      uid: user.user_firebase_id,
      firstName: user.firstName,
      lastName: user.lastName,
      image_url: user.image_url,
    },
  };
  const itemData = await items();
  const updatedInfo = await itemData.updateOne(
    { _id: new ObjectId(id) },
    // only update claims array with the new uid
    {
      $addToSet: {
        comments: commentObj,
      },
    }
  );
  if (updatedInfo.modifiedCount === 0) throw 'Could not update item';
  const updatedItem = await getItemById(id);
  return updatedItem;
};

export const deleteCommentById = async (id, commentId) => {
  id = validation.checkObjectId(id);
  const itemData = await items();
  const updatedInfo = await itemData.updateOne(
    { _id: new ObjectId(id) },
    // only update claims array with the new uid
    {
      $pull: {
        comments: { _id: new ObjectId(commentId) },
      },
    }
  );
  if (updatedInfo.modifiedCount === 0) throw 'Could not update item';
  const updatedItem = await getItemById(id);
  return updatedItem;
};

export const getItemBySearch = async (args) => {
  const itemCollection = await items();
  let itemList = await itemCollection.find({}).toArray();
  if (!itemList) {
    throw new Error({ status: 404, message: 'Not found' });
  }

  if (args.itemName) {
    itemList = itemList.filter((item) => {
      return item?.itemName
        ?.toLowerCase()
        .includes(args.itemName.toLowerCase());
    });
  }
  // console.log(itemList[0]);
  if (args.category) {
    itemList = itemList.filter((item) => {
      return item?.category
        ?.toLowerCase()
        .includes(args.category.toLowerCase());
    });
  }

  if (args.tags) {
    itemList = itemList.filter((item) => {
      let itemTags = item?.tags?.split(',');
      let argTags = args?.tags?.split(',');
      for (let i = 0; i < argTags.length; i++) {
        for (let j = 0; j < itemTags.length; j++) {
          if (argTags[i].toLowerCase() === itemTags[j].toLowerCase()) {
            return true;
          }
        }
      }
    });
  }

  if (args.lastSeenDate) {
    const date = new Date(args.lastSeenDate);
    itemList = itemList.filter((item) => {
      const itemDate = new Date(item?.lastSeenDate);
      return (
        itemDate.getFullYear() === date.getFullYear() &&
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getDate() === date.getDate()
      );
    });
  }

  if (args.itemStatus) {
    itemList = itemList.filter((item) => {
      return item?.itemStatus
        ?.toLowerCase()
        .includes(args.itemStatus.toLowerCase());
    });
  }

  return itemList;
};
