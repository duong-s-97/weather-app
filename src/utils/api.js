import baseApiUrlAuth from "./baseApi";

export const getApiDefault = (url) =>
  new Promise((resolve, reject) =>
    baseApiUrlAuth
      .get(url)
      .then((res) => resolve(res))
      .catch((err) => reject(err))
  );
