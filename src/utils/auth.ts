import cookie from "js-cookie";
import jwt from "jsonwebtoken";

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

export const getUserData = (): any => {
  const token = getUserToken() || "";
  return jwt.decode(token);
};
