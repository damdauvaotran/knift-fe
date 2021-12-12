import {
  deleteAuthRequest,
  getAuthRequest,
  postAuthRequest,
  putAuthRequest,
} from "./common";

export const getAllStudentByClassId = (
  classId: any,
  {
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }
) =>
  getAuthRequest({
    url: `/student/class/${classId}`,
    params: {
      limit,
      offset,
    },
  });

export const deleteStudentFromClass = (classId: any, studentId: any) =>
  deleteAuthRequest({
    url: `/student/${studentId}/class/${classId}`,
  });
