import { getAuthRequest } from "../common";

export const getAllClass = () =>
  getAuthRequest({
    url: `/class`,
  });
