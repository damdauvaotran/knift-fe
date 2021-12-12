import {
  deleteAuthRequest,
  getAuthRequest,
  postAuthRequest,
  putAuthRequest,
} from "./common";

export interface ICreateInvitation {
  classId: number;
  expire: number;
}

export const getInvitationInfo = (invitation: any) =>
  getAuthRequest({
    url: `/invitation/${invitation}`,
  });

export const createInvitation = (invitationInfo: ICreateInvitation) =>
  postAuthRequest({
    url: `/invitation`,
    data: invitationInfo,
  });

export const acceptInvitation = (invitation: any) =>
  postAuthRequest({
    url: `/invitation/accept`,
    data: { invitation },
  });
