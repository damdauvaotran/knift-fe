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

const makeRequestWithHeader = async (config) => {
  const res = await axios({
    ...config,
    baseURL: defaultEndpoint,
  });
  return res;
};

const makeAuthRequest = (config) => {
  return makeRequest({
    ...config,
    headers: {
      authorization: `Bearer ${getUserToken()}`,
    },
  });
};

const makeAuthRequestWithHeader = (config) => {
  return makeRequestWithHeader({
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

export const getAuthRequestWithHeader = (config) => {
  return makeAuthRequestWithHeader({
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
