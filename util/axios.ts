import ax, { AxiosRequestConfig } from "axios";
import { BASE_URL, IS_DEV } from "util/config";

const axiosOptions: AxiosRequestConfig = {
  withCredentials: true,
};

console.log("IS_DEV:", IS_DEV);

export const axios = ax.create({
  ...axiosOptions,
  baseURL: IS_DEV ? "http://localhost:8000/api" : `${BASE_URL}/api`,
});

axios.interceptors.request.use(
  (config) => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidG9rZW5JZCI6IjY2NWY2MjJkZjI2ZmNjZDQ1NDYyYzJlMiIsImVtYWlsIjoiYWRtaW5AdGVzdC5odSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyMjYxOTExOX0.xZymI4Ym0Sg2pZfiLyPojSUAsYgB98ekiUuZJSLZNAY"; // Itt megadhatod a tokenedet dinamikusan is
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
