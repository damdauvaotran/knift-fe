import {
  deleteAuthRequest,
  getAuthRequest,
  postAuthRequest,
  putAuthRequest,
} from "../common";

export const getAllStudent = () =>
  getAuthRequest({
    url: "/admin/students",
  });

export const getStudentById = (id) =>
  getAuthRequest({
    url: `/admin/student/${id}`,
  });

export const getStudentByMSSV = (mssv) =>
  getAuthRequest({
    url: `/admin/student/mssv/${mssv}`,
  });

export const createStudent = (name, mssv) =>
  postAuthRequest({
    url: "/admin/student",
    data: {
      name,
      mssv,
    },
  });

export const updateStudent = (id, name) =>
  putAuthRequest({
    url: `/admin/student/${id}`,
    data: {
      name,
    },
  });

export const deleteStudent = (id) =>
  deleteAuthRequest({
    url: `/admin/student/${id}`,
  });

export const importStudent = (file) =>
  postAuthRequest({
    url: `/admin/students/import`,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: file,
  });
