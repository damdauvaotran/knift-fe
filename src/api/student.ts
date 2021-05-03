import {
  deleteAuthRequest,
  getAuthRequest,
  postAuthRequest,
  putAuthRequest,
} from "./common";

export const getAllStudentByClassId = (classId: any) =>
  getAuthRequest({
    url: `/student/class/${classId}`,
  });

export const deleteStudentFromClass = (classId: any, studentId: any) =>
  deleteAuthRequest({
    url: `/student/${studentId}/class/${classId}`,
  });
