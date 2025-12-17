import ax, { AxiosRequestConfig } from "axios";
import { BASE_URL, IS_DEV } from "util/config";
import { getUserTokenFromCookie, getClientTokenFromCookie } from "./commons";

const axiosOptions: AxiosRequestConfig = {
  withCredentials: true,
};

export const axios = ax.create({
  ...axiosOptions,
  baseURL: IS_DEV ? "http://localhost:8000/api" : `${BASE_URL}/api`,
});

axios.interceptors.request.use(
  async (config) => {
    let token: string | null = null;

    // Check if we're on client side
    if (typeof window !== "undefined") {
      token = getClientTokenFromCookie();
    } else {
      token = await getUserTokenFromCookie();
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
