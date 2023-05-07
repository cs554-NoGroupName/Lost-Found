import {
  createItem,
  getItemById,
  getAllItems,
  updateItem,
  deleteItemById,
  getItemsByUserId,
} from '../data/items.js';
import redis from 'redis';
const client = redis.createClient();
client.connect().then(() => {});
import validation from '../utils/validation.js';
import { storage } from '../config/firebase-config.js';
export async function report(req, res) {
  let {
    type,
    itemName,
    description,
    category,
    tags,
    lastSeenLocation,
    lostDate,
    sendDate,
    imageUrl,
  } = req.body;
  let { uid } = req.user;

  const file = req.file;
  const fileName = Date.now().toString();
  const bucket = storage.bucket();
  const blob = bucket.file(fileName);
  const blobWriter = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });
  blobWriter.on('error', (err) => {
    console.log(err);
  });
  const publicUrl = `https://storage.googleapis.com/${bucket.itemName}/${fileName}`;
  blobWriter.on('finish', async () => {
    imageUrl = publicUrl;
  });
  console.log('imageUrl', imageUrl);
  try {
    // type = validation.checkType(type);
    // itemName = validation.checkItemName(itemName);
    // description = validation.checkDescription(description);
    // category = validation.checkCategory(category);
    // tags = validation.checkTags(tags);
    // lastSeenLocation = validation.checkLastSeenLocation(lastSeenLocation);
    // lostDate = validation.checkLostDate(lostDate);
    // sendDate = validation.checkSendDate(sendDate);
    // imageUrl = validation.checkImageUrl(imageUrl);
    const newItem = await createItem(
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
    );
    await client.set('getItem', JSON.stringify(getItem));
    res.status(201).json(newItem);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}

export async function getReportedItems(req, res) {
  try {
    const getItem = await getAllItems();
    await client.set('getItem', JSON.stringify(getItem));
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
    // console.log(getItemId);
    console.log('Getting data from db');
    await client.set(getItemId._id.toString(), JSON.stringify(getItemId));
    return res.status(200).json({ data: getItemId });
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
      // reportedBy,
      lastSeenLocation,
      itemStatus,
      type,
      category,
    } = req.body;

    if (
      !itemName &&
      !description &&
      // !reportedBy &&
      !lastSeenLocation &&
      !itemStatus &&
      !type &&
      !category
    )
      throw 'Should have atleast one parameter';
    id = validation.checkObjectId(id);
    if (itemName) {
      itemName = validation.checkNames(itemName, 'itemName');
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
    if (itemStatus) {
      itemStatus = validation.checkInputString(itemStatus, 'status');
    }
    if (type) {
      type = validation.checkInputString(type, 'type');
    }
    if (category) {
      category = validation.checkInputString(category, 'category');
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
      itemStatus,
      type,
      category,
    } = req.body;
    const updatedItem = await updateItem(
      id,
      itemName,
      description,
      lastSeenLocation,
      itemStatus,
      type,
      category
    );

    await client.set(updatedItem._id.toString(), JSON.stringify(updatedItem));
    await client.set('getItem', JSON.stringify(await getAllItems()));
    return res
      .status(200)
      .json({ message: 'Item updated successfully', data: updatedItem });
  } catch (e) {
    if (Object.keys(e).includes('status'))
      return res
        .status(e.status)
        .json({ message: 'Item updated successfully', error: e.message });
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
    const deleteItem = await deleteItemById(id);
    const exists = await client.exists(id);
    if (exists) await client.del(id);
    await client.set('getItem', JSON.stringify(await getAllItems()));
    return res
      .status(200)
      .json({ message: 'Item deleted successfully', data: deleteItem });
    // return res.status(200).json({ data:'deleted'});
  } catch (e) {
    if (Object.keys(e).includes('status'))
      return res.status(e.status).json({ error: e.message });
    return res.status(500).json({ error: e });
  }
}
