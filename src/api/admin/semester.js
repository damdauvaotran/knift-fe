import {
  deleteAuthRequest,
  getAuthRequest,
  postAuthRequest,
  putAuthRequest,
} from "../common";

export const getAllSemester = () =>
  getAuthRequest({
    url: "/admin/semesters",
  });

export const getSemesterById = (id) =>
  getAuthRequest({
    url: `/admin/semester/${id}`,
  });

export const createSemester = (semesterName) =>
  postAuthRequest({
    url: "/admin/semester",
    data: {
      semesterName,
    },
  });

export const updateSemester = (id, semesterName, isActive = true) =>
  putAuthRequest({
    url: `/admin/semester/${id}`,
    data: {
      semesterName,
      isActive,
    },
  });

export const deleteSemester = (id) =>
  deleteAuthRequest({
    url: `/admin/semester/${id}`,
  });
