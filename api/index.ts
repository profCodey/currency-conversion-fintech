import { queryClient } from "@/pages/_app";
import {
  APICLIENT_BASE_URL,
  APP_TOKENS,
  IDENTITY_BASE_URL,
} from "@/utils/constants";
import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
  baseURL: IDENTITY_BASE_URL,
});

export const apiClientInstance = axios.create({
  baseURL: APICLIENT_BASE_URL,
});

const addTokenToRequest = (request: any) => {
  const token = Cookies.get(APP_TOKENS.ACCESS_TOKEN);
  request.headers.Authorization = `Bearer ${token}`;
  return request;
};

axiosInstance.interceptors.request.use(addTokenToRequest);

axiosInstance.interceptors.response.use(
  function (response: any) {
    if (response.status === 401 && window.location.pathname !== "/login") {
      Cookies.remove(APP_TOKENS.ACCESS_TOKEN);
      Cookies.remove(APP_TOKENS.CATEGORY);
      Cookies.remove(APP_TOKENS.REFRESH_TOKEN);
      window.location.href = "/login";
      queryClient.clear();

      return;
    } else return response;
  },
  function (error) {
    if (
      error.response.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      Cookies.remove(APP_TOKENS.ACCESS_TOKEN);
      Cookies.remove(APP_TOKENS.CATEGORY);
      Cookies.remove(APP_TOKENS.REFRESH_TOKEN);

      window.location.href = "/login";
      queryClient.clear();
    } else {
      return Promise.reject(error);
    }
  }
);
