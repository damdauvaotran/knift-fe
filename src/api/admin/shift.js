import {
  deleteAuthRequest,
  getAuthRequest,
  postAuthRequest,
  putAuthRequest,
} from "../common";

export const getAllShift = () =>
  getAuthRequest({
    url: "/admin/shifts",
  });

export const getShiftById = (id) =>
  getAuthRequest({
    url: `/admin/shift/${id}`,
  });

export const createShift = (roomId, subjectId, date, from, to) =>
  postAuthRequest({
    url: "/admin/shift",
    data: {
      roomId,
      subjectId,
      date,
      from,
      to,
    },
  });

export const updateShift = (id, roomId, subjectId, date, from) =>
  putAuthRequest({
    url: `/admin/shift/${id}`,
    data: {
      roomId,
      subjectId,
      date,
      from,
    },
  });

export const deleteShift = (id) =>
  deleteAuthRequest({
    url: `/admin/shift/${id}`,
  });

export const importShift = (id) =>
  deleteAuthRequest({
    url: `/admin/shift/${id}`,
  });

export const getRegisteredStudentByShift = (id) =>
  getAuthRequest({
    url: `/admin/shift/${id}/registered`,
  });

export const getRegisteredStudent = () =>
  getAuthRequest({
    url: `/admin/shifts/registered`,
  });

/// ////////////////////////////
export const getAllShiftWithSemester = (semesterId) =>
  getAuthRequest({
    url: `/admin/shifts/semester/${semesterId}`,
  });

export const getShiftByIdWithSemester = (semesterId, id) =>
  getAuthRequest({
    url: `/admin/shift/${id}/semester/${semesterId}`,
  });

export const createShiftWithSemester = (
  semesterId,
  roomId,
  subjectId,
  date,
  from,
  to
) =>
  postAuthRequest({
    url: `/admin/shift/semester/${semesterId}`,
    data: {
      roomId,
      subjectId,
      date,
      from,
      to,
    },
  });

export const updateShiftWithSemester = (
  semesterId,
  id,
  roomId,
  subjectId,
  date,
  from
) =>
  putAuthRequest({
    url: `/admin/shift/${id}/semester/${semesterId}`,
    data: {
      roomId,
      subjectId,
      date,
      from,
    },
  });

export const deleteShiftWithSemester = (semesterId, id) =>
  deleteAuthRequest({
    url: `/admin/shift/${id}/semester/${semesterId}`,
  });

export const getRegisteredStudentWithSemester = (semesterId) =>
  getAuthRequest({
    url: `/admin/shifts/registered/semester/${semesterId}`,
  });
