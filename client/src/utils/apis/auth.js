import { makeApiCall } from "./api";

export const login = async (body) => {
  return await makeApiCall("/auth/login", "POST", body);
};

export const signup = async (data) => {
  return await makeApiCall("/auth/register", "POST", data);
};
