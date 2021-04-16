import {
  deleteAuthRequest,
  getAuthRequest,
  postAuthRequest,
  putAuthRequest,
} from "../common";

export const getAllSubject = () =>
  getAuthRequest({
    url: "/admin/subjects",
  });

export const getSubjectById = (id) =>
  getAuthRequest({
    url: `/admin/subject/${id}`,
  });

export const createSubject = (name, credit) =>
  postAuthRequest({
    url: "/admin/subject",
    data: {
      name,
      credit,
    },
  });

export const updateSubject = (id, name, credit) =>
  putAuthRequest({
    url: `/admin/subject/${id}`,
    data: {
      name,
      credit,
    },
  });

export const deleteSubject = (id) =>
  deleteAuthRequest({
    url: `/admin/subject/${id}`,
  });

export const importSubject = (file) =>
  postAuthRequest({
    url: `/admin/subjects/import`,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: file,
  });

export const importAllowedStudent = (subjectId, file) =>
  postAuthRequest({
    url: `/admin/subject/${subjectId}/import`,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: file,
  });
