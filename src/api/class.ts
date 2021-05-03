import {
  deleteAuthRequest,
  getAuthRequest,
  postAuthRequest,
  putAuthRequest,
} from "./common";

export interface ICreateClass {
  name: string;
  detail: string;
  startTime: number;
  endTime: number;
  subjectId: number;
}

export interface IUpdateClass {
  name: string;
  detail: string;
  startTime: number;
  endTime: number;
  subjectId: number;
}

export const getAllClass = () =>
  getAuthRequest({
    url: `/class`,
  });

export const getClassById = (id: any) =>
  getAuthRequest({
    url: `/class/${id}`,
  });

export const createClass = (classInfo: ICreateClass) => {
  return postAuthRequest({
    url: "/class",
    data: classInfo,
  });
};

export const updateClass = (classId: any, classInfo: IUpdateClass) => {
  return putAuthRequest({
    url: `/class/${classId}`,
    data: classInfo,
  });
};

export const deleteClass = (classId: any) => {
  return deleteAuthRequest({
    url: `/class/${classId}`,
  });
};
