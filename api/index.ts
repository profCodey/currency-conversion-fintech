import axios from "axios";
import Cookies from "js-cookie";
export function axiosInstance() {
  const token = Cookies.get("pycl_token");
  const tokenType = Cookies.get("pycl_token_type");
  return axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: token ? `${tokenType} ${token}` : null,
    },
  });
}
