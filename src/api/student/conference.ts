import { getAuthRequest } from "../common";

export const getAllConference = () =>
  getAuthRequest({
    url: `/conference`,
  });
