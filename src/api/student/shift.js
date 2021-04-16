import { postAuthRequest } from "../common";

export const studentRegisterShift = (shiftId) =>
  postAuthRequest({
    url: `/student/shift/${shiftId}/register`,
  });
