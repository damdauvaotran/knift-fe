import axios from "axios";

import { getUserToken } from "../utils/auth";

export const defaultEndpoint = "http://localhost:8000";

const makeRequest = async (config) => {
  const res = await axios({
    ...config,
    baseURL: defaultEndpoint,
  });
  return res.data;
};

const makeAuthRequest = (config) => {
  return makeRequest({
    ...config,
    headers: {
      authorization: `Bearer ${getUserToken()}`,
    },
  });
};

export const getRequest = (config) => {
  return makeRequest({
    ...config,
    method: "GET",
  });
};

export const postRequest = (config) => {
  return makeRequest({
    ...config,
    method: "POST",
  });
};

export const getAuthRequest = (config) => {
  return makeAuthRequest({
    ...config,
    method: "GET",
  });
};

export const postAuthRequest = (config) => {
  return makeAuthRequest({
    ...config,
    method: "POST",
  });
};

export const putAuthRequest = (config) => {
  return makeAuthRequest({
    ...config,
    method: "PUT",
  });
};

export const deleteAuthRequest = (config) => {
  return makeAuthRequest({
    ...config,
    method: "DELETE",
  });
};
