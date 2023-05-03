import {
  createItem,
  getItemById,
  getAllItems,
  getItemsByUserId,
} from '../data/items.js';
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
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
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
    res.status(201).json(newItem);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}
