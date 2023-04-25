const { items } = require("../config/mongoCollections");
const { internalServerError, badRequestError, checkId, notFoundError } = require("../helpers");
const { ObjectId } = require("mongodb");

const getItemById = async (id) => {
  try {
    // Validations
    id = checkId(id);
  } catch (err) {
    if (err.status && err.message) {
      throw err;
    } else throw badRequestError(err?.message ?? err);
  }

  id = id.trim();

  try {
    const itemsCollection = await items();

    // Check if item exists and fetch
    const fetchedItem = await itemsCollection.findOne({ _id: ObjectId(id)});
    if (!fetchedItem || fetchedItem === null) {
      throw notFoundError(`No item found with that id`);
    }
    return fetchedItem;
  } catch (err) {
    if (err.status && err.message) {
      throw err;
    } else throw internalServerError(err?.message ?? err);
  }
};

const createItem = async (
  name,
  description,
  priority,
  tags,
  category,
  reportedLocation,
  reportedBy,
  currentLocation,
  claims,
  disputes,
  timelineDetails,
  comments,
  images
) => {
  try {
    // Validations
  } catch (err) {
    if (err.status && err.message) {
      throw err;
    } else throw badRequestError(err?.message ?? err);
  }

  try {
    // TODO: Complete entire function
    const status = "open";
    const type = "lost";
    const reportedDate = new Date();
  } catch (err) {
    if (err.status && err.message) {
      throw err;
    } else throw internalServerError(err?.message ?? err);
  }
};

const addComment = async (itemId, comment, userId) => {
  try {
    // Validations
    checkId(itemId);
    checkId(userId);
  } catch (err) {
    if (err.status && err.message) {
      throw err;
    } else throw badRequestError(err?.message ?? err);
  }

  comment = comment.trim();
  itemId = itemId.trim();
  userId = userId.trim();

  try {
    const itemsCollection = await items();
    let newComment = {
      _id: ObjectId(),
      comment,
      userId
    };

    // Check if item exists in DB
    const itemFound = await itemsCollection.findOne({ _id: ObjectId(itemId) });
    if (!itemFound || itemFound === null)
      throw notFoundError("No item found with that id");

    // Update comment
    const updatedItem = await itemsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $push: { comments: newComment } }
    );
    if (updatedItem?.acknowledged && updatedItem?.modifiedCount === 1) {
      const fetchedItem = await getItemById(id);
      if (!fetchedItem) throw notFoundError("Could not find item");
      return fetchedItem;
    } else {
      throw internalServerError("Failed to add comment to item");
    }
  } catch (err) {
    if (err.status && err.message) {
      throw err;
    } else throw internalServerError(err?.message ?? err);
  }
};

const deleteComment = async (itemId, commentId, userId) => {
  try {
    // Validations
    checkId(itemId);
    checkId(commentId);
    checkId(userId);
  } catch (err) {
    if (err.status && err.message) {
      throw err;
    } else throw badRequestError(err?.message ?? err);
  }

  itemId = itemId.trim();
  commentId = commentId.trim();
  userId = userId.trim();

  try {
    const itemsCollection = await items();

    // Check if item exists in DB
    const itemFound = await itemsCollection.findOne({ _id: ObjectId(itemId) });
    if (!itemFound || itemFound === null)
      throw notFoundError("No item found with that id");

    // Check if the user deleting the comment is the one who posted it
    itemFound.comments.forEach((comment) => {
      if (comment._id.toString() === commentId && comment.userId.toString() !== userId) {
        throw unauthorizedError("Only the user that posted the comment can delete it");
      }
    });

    // Update comment
    const updatedItem = await itemsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $pull: { comments: {
        _id: ObjectId(commentId)
      } } }
    );
    if (updatedItem?.acknowledged && updatedItem?.modifiedCount === 1) {
      const fetchedItem = await getItemById(id);
      if (!fetchedItem) throw notFoundError("Could not find item");
      return fetchedItem;
    } else {
      throw internalServerError("Failed to add comment to item");
    }
  } catch (err) {
    if (err.status && err.message) {
      throw err;
    } else throw internalServerError(err?.message ?? err);
  }
};

export {
  getItemById,
  addComment,
  deleteComment,
  createItem,
};
