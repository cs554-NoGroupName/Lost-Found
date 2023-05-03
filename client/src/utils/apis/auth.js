import { makeApiCall } from "./api";

export const login = async (token) => {
  return await makeApiCall(
    "/auth/login",
    "POST",
    {},
    {
      Authorization: `Bearer ${token}`
    }
  );
};

export const signup = async (data) => {
  return await makeApiCall("/auth/register", "POST", data);
};
