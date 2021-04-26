import React from "react";
import {
  Router,
  Switch,
  Route,
  Redirect,
  BrowserRouter,
} from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { createBrowserHistory } from "history";
import "./App.scss";
import "antd/dist/antd.css";

import { isLogin } from "./utils/auth";
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

import { store } from "./redux/store";
import { useSelector } from "react-redux";

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

const customHistory = createBrowserHistory();

const App = () => {
  const isLoginSelector = useSelector((state: any) => state.isLogin);

  console.log(isLoginSelector);
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
          <Route path="/login">{requireNotAuth(<Login />)}</Route>
          <Route path="/register">{requireNotAuth(<Register />)}</Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
