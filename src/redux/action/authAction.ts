import { authType } from "../types";

export const loginAction = (token: string) => {
  return {
    type: authType.login,
    value: { token, isLogin: true },
  };
};
export const logoutAction = () => {
  return {
    type: authType.logout,
    value: { token: "", isLogin: false },
  };
};
