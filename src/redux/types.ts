export interface IAction {
  type: string;
  value: Object;
}

export const authType = {
  login: "LOGIN",
  logout: "LOGOUT",
};
