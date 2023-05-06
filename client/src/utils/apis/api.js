import axios from "axios";
import { toast } from "react-toastify";
const baseUrl = process.env.REACT_APP_BASE_URL;

const errosStatusCodes = [500, 409, 404, 400, 401];
export const makeApiCall = async (endpoint, method, body, headers = null) => {
  let results = {};
  const token = localStorage.getItem("token");
  try {
    await axios({
      url: baseUrl + endpoint,
      method,
      data: body,
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + token ?? "",

        ...headers,
      },
    }).then((res) => {
      const { data, status } = res;
      results.data = data;
      results.status = status;
    });
    return results;
  } catch (err) {
    const { response } = err;
    const { status, data } = response;
    // console.log({ response });
    if (errosStatusCodes.includes(status)) {
      // toast.error(data?.error);
      const err = { status, data };
      return err;
    }
    toast.error("Something went wrong!");
  }
};
