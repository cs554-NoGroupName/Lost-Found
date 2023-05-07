import { makeApiCall } from "./api";

export const reportItem = async (data, token) => {
  return await makeApiCall("/items/report", "POST", data, {
    Authorization: "Bearer " + token,
  });
};
