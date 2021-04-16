import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import "./App.scss";
import "antd/dist/antd.css";

import { isLogin } from "./utils/auth";
import translationVI from "./locales/vi.json";

import Login from "./pages/login";
import Register from "./pages/register";
import ExamRegister from "./pages/conference";
// import SubjectManager from "./pages/admin/subject";
// import RoomManager from "./pages/admin/room";
// import ShiftManager from "./pages/admin/shift";
// import StudentManager from "./pages/admin/student";
// import SemesterManger from "./pages/admin/semester";
import "./assets/font/Roboto-Regular.ttf";

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

function App() {
  return (
    <div className="App">
      <Router forceRefresh>
        <Switch>
          <Route exact path="/">
            {requireAuth(<ExamRegister />)}
          </Route>
          <Route path="/login">{requireNotAuth(<Login />)}</Route>
          {/*<Route path="/admin/subject">{requireAuth(<SubjectManager />)}</Route>*/}
          {/*<Route path="/admin/room">{requireAuth(<RoomManager />)}</Route>*/}
          {/*<Route path="/admin/shift">{requireAuth(<ShiftManager />)}</Route>*/}
          {/*<Route path="/admin/student">{requireAuth(<StudentManager />)}</Route>*/}
          {/*<Route exact path="/admin/semester">*/}
          {/*  {requireAuth(<SemesterManger />)}*/}
          {/*</Route>*/}
          {/*<Route exact path="/admin/semester/:id">*/}
          {/*  {requireAuth(<ShiftManager />)}*/}
          {/*</Route>*/}
          <Route path="/register">{requireNotAuth(<Register />)}</Route>
        </Switch>
      </Router>
    </div>
  );
}

function requireAuth(component: any) {
  if (isLogin()) {
    return component;
  }
  return (
    <Redirect
      to={{
        pathname: "/login",
      }}
    />
  );
}

function requireNotAuth(component: any) {
  if (!isLogin()) {
    return component;
  }
  return (
    <Redirect
      to={{
        pathname: "/",
      }}
    />
  );
}

export default App;
