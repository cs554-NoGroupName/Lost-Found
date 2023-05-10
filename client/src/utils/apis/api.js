import axios from "axios";
import { toast } from "react-toastify";
import store from "../../redux/store";
import { setUserData } from "redux/reducer";
const baseUrl = process.env.REACT_APP_BASE_URL;

export const makeApiCall = async (endpoint, method, body, headers = null) => {
  let results = {};

  const token = localStorage.getItem("token");
  try {
    await axios({
      url: baseUrl + endpoint,
      method,
      data: body,
      headers: token
        ? {
            ...headers,
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${token}`,
          }
        : headers,
    }).then((res) => {
      const { data, status } = res;
      results.data = data;
      results.status = status;
    });
    return results;
  } catch (err) {
    const { response } = err;
    const { status, data } = response;
    if (status === 401 && data?.message === "Invalid authorization token.") {
      toast.info("Session expired!");
      toast.error("Logging out...");
      localStorage.setItem("token", null);
      return store.dispatch(setUserData({ data: {} }));
    } else {
      const err = { status, data };
      return err;
    }
  }
};
