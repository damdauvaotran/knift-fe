import { authType, IAction } from "../types";

const initialState = { token: "", isLogin: true };

const authReducer = (state = initialState, action: IAction) => {
  switch (action.type) {
    case authType.login: {
      return { ...state, ...action.value };
    }
    case authType.logout: {
      return { ...state, ...action.value };
    }
    default:
      return state;
  }
};

export default authReducer;
