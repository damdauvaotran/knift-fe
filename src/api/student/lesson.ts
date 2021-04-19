import { getAuthRequest } from "../common";

export const getAllLesson = () =>
  getAuthRequest({
    url: `/lesson`,
  });
