import { APP_TOKENS } from "@/utils/constants";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

export function axiosInstance() {
  const token = Cookies.get(APP_TOKENS.ACCESS_TOKEN);
  const _instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_IDENTITY_BASE_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : null,
    },
  });
  return _instance;
}
