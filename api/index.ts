import { APP_TOKENS } from "@/utils/constants";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_IDENTITY_BASE_URL,
});

export const apiClientInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APICLIENT_BASE_URL,
});

const addTokenToRequest = (request: any) => {
  const token = Cookies.get(APP_TOKENS.ACCESS_TOKEN);
  request.headers.Authorization = `Bearer ${token}`;
  return request;
};

axiosInstance.interceptors.request.use(addTokenToRequest);

axiosInstance.interceptors.response.use(
  function (response: any) {
    if (response.status === 401) {
      Cookies.remove(APP_TOKENS.ACCESS_TOKEN);
      Cookies.remove(APP_TOKENS.CATEGORY);
      Cookies.remove(APP_TOKENS.REFRESH_TOKEN);
      window.location.href = "/login";
      return;
    } else return response;
  },
  function (error) {
    if (error.response.status === 401) {
      Cookies.remove(APP_TOKENS.ACCESS_TOKEN);
      Cookies.remove(APP_TOKENS.CATEGORY);
      Cookies.remove(APP_TOKENS.REFRESH_TOKEN);

      window.location.href = "/login";
    } else {
      return Promise.reject(error);
    }
  }
);
