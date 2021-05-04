import React, { useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { Layout, Menu, Button, Typography, Card } from "antd";
import Icon from "@ant-design/icons";
import "./layout.scss";

import { getUserData, clearUserToken } from "../../utils/auth";
import menu from "./menu";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../redux/action/authAction";

const { SubMenu } = Menu;

const { Header, Content, Footer, Sider } = Layout;
const { Text, Title } = Typography;
interface ILayoutState {
  collapsed: boolean;
  isLogout: boolean;
}

export const withLayout = (selectedKey: any) => (WrappedComponent: any) => (
  props: any
) => {
  const [collapsed, setCollapsed] = useState<boolean>();
  const [isLogout, setIsLogout] = useState<boolean>();
  const dispatch = useDispatch();
  const history = useHistory();

  const onLogout = () => {
    clearUserToken();
    dispatch(logoutAction());
    // setIsLogout(true);
    history.push("/login");
  };

  // if (isLogout) {
  //   // return <Redirect to="/login" />;
  // }

  const backToDashboard = () => {
    history.push("/");
  };
  const data: any = getUserData();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#fff", padding: 0 }}>
        <div className="header">
          <div className="logo" onClick={backToDashboard}>
            <img
              src="https://uet.vnu.edu.vn/wp-content/uploads/2019/03/logo-outline.png"
              alt=""
              style={{ width: 75 }}
            />
          </div>
          <Button type="primary" danger onClick={onLogout}>
            Logout
          </Button>
        </div>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <Card style={{ margin: "10px 0" }}>
          <Title level={5} style={{ textAlign: "left" }}>
            {selectedKey}
          </Title>
        </Card>
        <Card>
          <WrappedComponent {...props} />
        </Card>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Knift ©2021 Created by Knift Team
      </Footer>
    </Layout>
  );
};
