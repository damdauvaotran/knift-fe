import {
  deleteAuthRequest,
  getAuthRequest,
  postAuthRequest,
  putAuthRequest,
} from "../common";

export const getAllRoom = () =>
  getAuthRequest({
    url: "/admin/rooms",
  });

export const getRoomById = (id) =>
  getAuthRequest({
    url: `/admin/room/${id}`,
  });

export const createRoom = (roomName, totalSlot) =>
  postAuthRequest({
    url: "/admin/room",
    data: {
      roomName,
      totalSlot,
    },
  });

export const updateRoom = (id, roomName, totalSlot) =>
  putAuthRequest({
    url: `/admin/room/${id}`,
    data: {
      roomName,
      totalSlot,
    },
  });

export const deleteRoom = (id) =>
  deleteAuthRequest({
    url: `/admin/room/${id}`,
  });

export const importRoom = (fileData) =>
  postAuthRequest({
    url: `/admin/rooms/import`,
    data: fileData,
  });
