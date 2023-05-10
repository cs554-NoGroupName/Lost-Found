import { makeApiCall } from "./api";

export const updateUserProfileData = async (data) => {
  return await makeApiCall("/user/update", "POST", data);
};
export const getUserDetails = async () => {
  return await makeApiCall("/user", "GET");
};
export const getUserActivites = async () => {
  return await makeApiCall("/user/myActivity", "GET");
};
export const uploadUserProfilePhoto = async (data) => {
  return await makeApiCall("/user/image", "POST", data);
};
export const deleteUser = async (data) => {
  return await makeApiCall("/user/delete", "POST", data);
};
