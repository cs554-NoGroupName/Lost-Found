import { makeApiCall } from "./api";

export const reportItem = async (data, token) => {
  return await makeApiCall("/items/report", "POST", data);
};

export const getItemDetailsById = async (id) => {
  return await makeApiCall("/items/" + id, "GET");
};

export const deleteItemById = async (id) => {
  return await makeApiCall("/items/delete/" + id, "GET");
};

export const sendClaimRequest = async (id) => {
  return await makeApiCall("/items/claim/" + id, "GET");
};
export const addComment = async (id, data) => {
  return await makeApiCall("/items/comment/" + id, "POST", data);
};
export const deleteComment = async (id, commentId) => {
  return await makeApiCall(
    "/items/comment/delete/" + id + "/" + commentId,
    "GET"
  );
};

export const comfirmClaimRequest = async (id, userId) => {
  return await makeApiCall("/items/resolveClaim/" + id + "/" + userId, "GET");
};
export const declineClaimRequest = async (id, userId) => {
  return await makeApiCall("/items/rejectClaim/" + id + "/" + userId, "GET");
};
