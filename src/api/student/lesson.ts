import { getAuthRequest } from "../common";

export const getAllLesson = () =>
  getAuthRequest({
    url: `/lesson`,
  });

export const getAllLessonByClassId = (classId: any) =>
  getAuthRequest({
    url: `/lesson/class/${classId}`,
  });
