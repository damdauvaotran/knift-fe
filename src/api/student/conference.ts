import { getAuthRequest } from "../common";

export const getAllConference = () =>
  getAuthRequest({
    url: `/conference`,
  });

export const getAllConferenceWithLessonId = (lessonId: any) =>
  getAuthRequest({
    url: `/conference/lesson/${lessonId}`,
  });
