import {
  deleteAuthRequest,
  getAuthRequest,
  postAuthRequest,
  getAuthRequestWithHeader,
} from "./common";

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
  return getAuthRequestWithHeader({
    url: `/conference/${conferenceId}/attendance`,
    responseType: "blob",
  });
};

export const endConference = (conferenceId: any) => {
  return postAuthRequest({
    url: `/conference/${conferenceId}/end`,
  });
};
