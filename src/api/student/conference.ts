import { deleteAuthRequest, getAuthRequest, postAuthRequest } from "../common";

export interface ICreateConference {
  lessonId: any;
  startTime: number;
  endTime: number;
}

export const getAllConference = () =>
  getAuthRequest({
    url: `/conference`,
  });

export const getAllConferenceWithLessonId = (lessonId: any) =>
  getAuthRequest({
    url: `/conference/lesson/${lessonId}`,
  });

export const createConference = (conferenceInfo: ICreateConference) => {
  return postAuthRequest({
    url: "/conference",
    data: conferenceInfo,
  });
};

export const deleteConference = (conferenceId: any) => {
  return deleteAuthRequest({
    url: `/conference/${conferenceId}`,
  });
};

export const getAttendanceList = (conferenceId: any) => {
  return getAuthRequest({
    url: `/conference/${conferenceId}/attendance`,
  });
};
