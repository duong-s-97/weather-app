import axios from "axios";
import { baseApi } from "./constant";

const baseApiUrlAuth = `${baseApi}/`;

const baseInstance = axios.create({
  baseURL: baseApiUrlAuth,
});

baseInstance.defaults.timeout = 60000;

baseInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;
    }

    return Promise.reject(error);
  }
);

export default baseInstance;
