import React, { useEffect } from "react";
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import "./App.scss";
import "antd/dist/antd.css";

import { getUserToken, isLogin } from "./utils/auth";
import translationVI from "./locales/vi.json";

import Login from "./pages/login";
import Register from "./pages/register";
import ConferencePlayer from "./pages/conference";
import ClassList from "./pages/class";
import ClassInfo from "./pages/classInfo";
import LessonInfo from "./pages/lessonInfo";
import CreateClass from "./pages/createClass";
import CreateLesson from "./pages/createLesson";
import CreateConference from "./pages/createConference";
import Invitation from "./pages/invitation";

import { useDispatch, useSelector } from "react-redux";
import { loginAction, logoutAction } from "./redux/action/authAction";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      vi: {
        translation: translationVI,
      },
    },
    lng: "vi",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

const App = () => {
  const isLoginSelector = useSelector((state: any) => state.isLogin);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isLogin()) {
      const token = getUserToken();
      dispatch(loginAction(token ?? ""));
    } else {
      dispatch(logoutAction());
    }
  }, []);

  const requireAuth = (component: any) => {
    if (isLoginSelector) {
      return component;
    }
    return (
      <Redirect
        to={{
          pathname: "/login",
        }}
      />
    );
  };

  const requireNotAuth = (component: any) => {
    if (!isLoginSelector) {
      return component;
    }
    return (
      <Redirect
        to={{
          pathname: "/",
        }}
      />
    );
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            {requireAuth(<ClassList />)}
          </Route>
          <Route exact path="/class">
            {requireAuth(<ClassList />)}
          </Route>
          <Route exact path="/class/create">
            {requireAuth(<CreateClass />)}
          </Route>
          <Route exact path="/class/:classId/lesson/create">
            {requireAuth(<CreateLesson />)}
          </Route>
          <Route exact path="/lesson/:lessonId/conference/create">
            {requireAuth(<CreateConference />)}
          </Route>
          <Route exact path="/class/:id">
            {requireAuth(<ClassInfo />)}
          </Route>
          <Route exact path="/lesson/:id">
            {requireAuth(<LessonInfo />)}
          </Route>
          <Route exact path="/conference/:id">
            {requireAuth(<ConferencePlayer />)}
          </Route>
          <Route exact path="/invitation/:invitation">
            {requireAuth(<Invitation />)}
          </Route>
          <Route path="/login">{requireNotAuth(<Login />)}</Route>
          <Route path="/register">{requireNotAuth(<Register />)}</Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
