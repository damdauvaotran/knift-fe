import {
  deleteAuthRequest,
  getAuthRequest,
  postAuthRequest,
  putAuthRequest,
} from "./common";

export interface ICreateLesson {
  name: string;
  detail: string;
  classId: any;
  startTime: number;
  endTime: number;
}

export interface IUpdateLesson {
  name: string;
  detail: string;
  startTime: number;
  endTime: number;
}

export const getAllLesson = () =>
  getAuthRequest({
    url: `/lesson`,
  });

export const getAllLessonByClassId = (
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
    url: `/lesson/class/${classId}`,
    params: {
      limit,
      offset,
    },
  });

export const getLessonById = (lessonId: any) =>
  getAuthRequest({
    url: `/lesson/${lessonId}`,
  });

export const createLesson = (lessonInfo: ICreateLesson) => {
  return postAuthRequest({
    url: "/lesson",
    data: lessonInfo,
  });
};

export const updateLesson = (lessonId: any, lessonInfo: IUpdateLesson) => {
  return putAuthRequest({
    url: `/lesson/${lessonId}`,
    data: lessonInfo,
  });
};

export const deleteLesson = (lessonId: any) => {
  return deleteAuthRequest({
    url: `/lesson/${lessonId}`,
  });
};
