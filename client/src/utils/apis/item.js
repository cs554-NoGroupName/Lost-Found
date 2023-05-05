import { makeApiCall } from "./api";

export const reportItem = async (data, headers) => {
  return await makeApiCall("/items/report", "POST", data, headers);
};
