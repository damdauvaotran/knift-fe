import cookie from "js-cookie";
import jwt from "jsonwebtoken";

export interface IUSerInfo {
  id: number;
  role: string;
  displayName: string;
}

export const getUserToken = () => {
  return cookie.get("kniftToken");
};

export const setUserToken = (token: string, expire = 3) => {
  return cookie.set("kniftToken", token, { expires: expire });
};

export const clearUserToken = () => {
  return cookie.remove("kniftToken");
};

export const isLogin = () => {
  const token = getUserToken();
  if (token) {
    // @ts-ignore
    const { exp } = jwt.decode(token);
    return exp * 1000 >= Date.now();
  }
  return false;
};

export const getUserData = (): IUSerInfo => {
  const token = getUserToken() || "";
  return (jwt.decode(token) as IUSerInfo) ?? { id: null, role: null };
};
