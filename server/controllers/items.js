import {
  createItem,
  getItemById,
  getAllItems,
  updateItem,
  deleteItemById,
  getItemsByUserId,
  updateClaims,
  resolveClaimById,
  updateDispute,
  rejectClaimById,
  addComment,
  deleteCommentById,
  getItemBySearch,
  uploadImage,
} from '../data/items.js';
import dotenv from 'dotenv';
dotenv.config();

import getClient from '../utils/redisClient.js';
const client = await getClient();

import validation from '../utils/validation.js';
import { BlobServiceClient } from '@azure/storage-blob';
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient('images');

export async function report(req, res) {
  let {
    type,
    itemName,
    description,
    category,
    tags,
    lastSeenLocation,
    lastSeenDate,
    imageUrl,
  } = req.body;
  let { uid } = req.user;

  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'Please upload a image!' });
    }
    const imageData = req.file.buffer;
    const blobName = `${Date.now()}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const file_type = file.mimetype;
    const uploadBlobResponse = await blockBlobClient.uploadData(imageData, {
      blobHTTPHeaders: { blobContentType: file_type },
    });
    imageUrl = blockBlobClient.url;
  } catch (e) {
    return res.status(400).json({ message: e });
  }

  try {
    type = validation.checkType(type);
    itemName = validation.checkItemName(itemName);
    description = validation.checkDescription(description);
    category = validation.checkCategory(category);
    tags = validation.checkTags(tags);
    lastSeenLocation = validation.checkLastSeenLocation(lastSeenLocation);
    lastSeenDate = validation.checkLastSeenDate(lastSeenDate);
    const newItem = await createItem(
      type,
      itemName,
      description,
      category,
      tags,
      lastSeenLocation,
      lastSeenDate,
      imageUrl,
      uid
    );
    await client.set(`Item_${newItem._id.toString()}`, JSON.stringify(newItem));
    res.status(201).json(newItem);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}

export async function updateImage(req, res) {
  let { id } = req.params;
  let { uid } = req.user;
  try {
    id = validation.checkObjectId(id);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  // check if the user is the owner of the item
  const item = await getItemById(id);
  if (item.uid !== uid) throw 'You cannot update image for this item';

  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'Please upload a image!' });
    }
    const imageData = req.file.buffer;
    const blobName = `${Date.now()}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const file_type = file.mimetype;
    const uploadBlobResponse = await blockBlobClient.uploadData(imageData, {
      blobHTTPHeaders: { blobContentType: file_type },
    });
    const imageUrl = blockBlobClient.url;
    const updatedItem = await uploadImage(id, imageUrl);
    await client.set(
      `Item_${updatedItem._id.toString()}`,
      JSON.stringify(updatedItem)
    );
    return res.status(200).json({ updatedItem });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}

export async function claimRequest(req, res) {
  let { id } = req.params;
  let { uid } = req.user;
  try {
    id = validation.checkObjectId(id);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const item = await getItemById(id);
    if (item.uid === uid) throw 'You cannot claim your own item';
    if (item.itemStatus === 'claimed') throw 'Item already claimed';
    if (item.itemStatus === 'resolved') throw 'Item already resolved';
    // check if user has already requested for the item
    const found = item.claims.find((claim) => claim.userId === uid);
    if (found) throw 'You have already requested for this item';

    const updatedItem = await updateClaims(id, uid);
    await client.set(
      `Item_${updatedItem._id.toString()}`,
      JSON.stringify(updatedItem)
    );
    return res.status(200).json({ updatedItem });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}

export async function resolveClaim(req, res) {
  let { itemId, claimId } = req.params;
  let { uid } = req.user;

  try {
    const item = await getItemById(itemId);
    if (item.uid !== uid) throw 'You cannot resolve claim for this item';
    const updatedItem = await resolveClaimById(itemId, claimId, uid);
    await client.set(
      `Item_${updatedItem._id.toString()}`,
      JSON.stringify(updatedItem)
    );
    return res.status(200).json({ updatedItem });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}

export async function rejectClaim(req, res) {
  let { itemId, claimId } = req.params;
  let { uid } = req.user;

  try {
    const item = await getItemById(itemId);
    if (item.uid !== uid) throw 'You cannot reject claim for this item';
    const updatedItem = await rejectClaimById(itemId, claimId, uid);
    await client.set(
      `Item_${updatedItem._id.toString()}`,
      JSON.stringify(updatedItem)
    );
    return res.status(200).json({ updatedItem });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}

export async function disputeRequest(req, res) {
  let { itemId } = req.params;
  let { uid } = req.user;
  let { reason } = req.body;
  try {
    const item = await getItemById(itemId);
    if (item.uid !== uid) throw 'You cannot dispute claim for this item';
    if (item.itemStatus !== 'claimed') throw 'Item not claimed, cannot dispute';
    const updatedItem = await updateDispute(itemId, uid, reason);
    await client.set(
      `Item_${updatedItem._id.toString()}`,
      JSON.stringify(updatedItem)
    );
    return res.status(200).json({ updatedItem });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}

export async function comment(req, res) {
  let { id } = req.params;
  let { uid } = req.user;
  let { comment } = req.body;
  try {
    id = validation.checkObjectId(id);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const updatedItem = await addComment(id, uid, comment);
    await client.set(
      `Item_${updatedItem._id.toString()}`,
      JSON.stringify(updatedItem)
    );
    return res.status(200).json({ updatedItem });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}

export async function commentDelete(req, res) {
  let { id, commentId } = req.params;
  let { uid } = req.user;
  try {
    id = validation.checkObjectId(id);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  // check if the user is the owner of the comment

  try {
    const item = await getItemById(id);
    const comment = item.comments.find((comment) => comment._id == commentId);
    if (comment.userId !== uid) throw 'You cannot delete this comment';
    const updatedItem = await deleteCommentById(id, commentId);
    await client.set(
      `Item_${updatedItem._id.toString()}`,
      JSON.stringify(updatedItem)
    );
    return res.status(200).json({ updatedItem });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}

export async function getReportedItems(req, res) {
  try {
    const getItem = await getAllItems(req.query);
    // await client.set('getItem', JSON.stringify(getItem));
    console.log('Loading items from db');
    return res
      .status(200)
      .json({ message: 'Listing all reported items', data: getItem });
  } catch (e) {
    return res.status(500).json({ error: 'Server Error' });
  }
}

export async function getReportedItemById(req, res) {
  let id = req.params.id;
  let error = {};
  try {
    id = validation.checkObjectId(id);
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    const getItemId = await getItemById(id);
    console.log('Getting data from db');
    await client.set(
      `Item_${getItemId._id.toString()}`,
      JSON.stringify(getItemId)
    );
    return res.status(200).json(getItemId);
  } catch (e) {
    if (Object.keys(e).includes('status'))
      return res.status(e.status).json({ error: e.message });
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateReportedItem(req, res) {
  try {
    let id = req.params.id;
    let {
      itemName,
      description,
      lastSeenLocation,
      tags,
      category,
      lastSeenDate,
    } = req.body;

    if (!itemName && !description && !lastSeenLocation && !tags && !category)
      throw 'Should have atleast one parameter';
    id = validation.checkObjectId(id);
    if (itemName) {
      itemName = validation.checkInputString(itemName, 'itemName');
    }
    if (description) {
      description = validation.checkInputString(description, 'description');
    }
    if (lastSeenLocation) {
      lastSeenLocation = validation.checkInputString(
        lastSeenLocation,
        'lastSeenLocation'
      );
    }
    if (tags) {
      tags = validation.checkTags(tags);
    }
    if (category) {
      category = validation.checkInputString(category, 'category');
    }
    if (lastSeenDate) {
      lastSeenDate = validation.checkLastSeenDate(lastSeenDate);
    }
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    let id = req.params.id;
    let {
      itemName,
      description,
      lastSeenLocation,
      lastSeenDate,
      category,
      tags,
    } = req.body;
    const updatedItem = await updateItem(
      id,
      itemName,
      description,
      lastSeenLocation,
      lastSeenDate,
      tags,
      category
    );

    await client.set(
      `Item_${updatedItem._id.toString()}`,
      JSON.stringify(updatedItem)
    );
    // await client.set('getItem', JSON.stringify(await getAllItems()));
    return res
      .status(200)
      .json({ message: 'Item updated successfully', updatedItem });
  } catch (e) {
    if (Object.keys(e).includes('status'))
      return res.status(e.status).json({ error: e.message });
    return res.status(500).json({ error: e });
  }
}

export async function deleteReportedIemById(req, res) {
  try {
    let id = req.params.id;
    id = validation.checkObjectId(id);
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    let id = req.params.id;
    let uid = req.user.uid;
    const item = await getItemById(id);
    if (item.uid !== uid) throw 'You cannot delete this item';
    const deleteItem = await deleteItemById(id);
    const exists = await client.exists(`Item_${deleteItem._id.toString()}`);
    if (exists) await client.del(`Item_${deleteItem._id.toString()}`);
    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (e) {
    if (Object.keys(e).includes('status'))
      return res.status(e.status).json({ error: e.message });
    return res.status(500).json({ error: e });
  }
}

// http://localhost:4000/items/report/search?itemStatus=claimed&itemName=phone&tags=phone&category=electronics&lastSeenDate=2023-04-12T04:05:49.000Z
export async function getReportedItemBySearch(req, res) {
  try {
    const getItems = await getItemBySearch(req.query);
    return res
      .status(200)
      .json({ message: 'Item fetched successfully', data: getItems });
  } catch (e) {
    if (Object.keys(e).includes('status'))
      return res.status(e.status).json({ error: e.message });
    return res.status(500).json({ error: e });
  }
}
