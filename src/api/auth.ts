import { postRequest } from "./common";

interface IRegisterReq {
  username: string;
  password: string;
  displayName: string;
  gender: string;
  email: string;
  roleId: number;
}
interface ILoginReq {
  username: string;
  password: string;
}

export const login = ({ username, password }: ILoginReq) => {
  return postRequest({
    url: "/auth/login",
    data: {
      username,
      password,
    },
  });
};

export const register = ({
  username,
  password,
  gender,
  displayName,
  email,
  roleId,
}: IRegisterReq) => {
  return postRequest({
    url: "/auth/signup",
    data: {
      username,
      password,
      gender,
      email,
      displayName,
      roleId,
    },
  });
};
