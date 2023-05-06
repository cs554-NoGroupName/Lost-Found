import {
  updateUserByFirebaseId,
  deleteUserByFirebaseId,
  getUserByFirebaseId,
  updateUserImage,
} from '../data/users.js';
import validation from '../utils/validation.js';

export const updateUser = async (req, res) => {
  let { firstName, lastName, phone, dob, gender } = req.body;
  let { uid } = req.user;

  try {
    const updatedUser = await updateUserByFirebaseId(
      uid,
      firstName,
      lastName,
      phone,
      dob,
      gender
    );
    return res.status(200).json(updatedUser);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};

export const deleteUser = async (req, res) => {
  let { uid } = req.user;
  try {
    await deleteUserByFirebaseId(uid);
    return res.status(200).json({ deleted: true });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};

export const getUser = async (req, res) => {
  let { uid } = req.user;
  try {
    const user = await getUserByFirebaseId(uid);
    return res.status(200).json(user);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};

export const updateImage = async (req, res) => {
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
    const imageUrl = blockBlobClient.url;
    const updatedUser = await updateUserImage(uid, imageUrl);
    return res.status(200).json(updatedUser);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};
