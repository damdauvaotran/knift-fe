import { getAuthRequest, postAuthRequest, putAuthRequest } from "../common";

export const getAllSubject = () =>
  getAuthRequest({
    url: `/subject`,
  });
