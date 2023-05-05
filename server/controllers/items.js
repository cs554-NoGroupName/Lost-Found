import {
  createItem,
  getItemById,
  getAllItems,
  getItemsByUserId,
} from '../data/items.js';
import validation from '../utils/validation.js';
import { BlobServiceClient } from '@azure/storage-blob';
import dotenv from 'dotenv';
dotenv.config();
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
      return res.status(400).json({ error: 'Please upload a image!' });
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
    return res.status(400).json({ error: e });
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
    res.status(201).json(newItem);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}
