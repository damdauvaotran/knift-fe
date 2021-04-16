import React from "react";
import { Link, Redirect } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import Icon from "@ant-design/icons";
import "./layout.scss";

import { getUserData, clearUserToken } from "../../utils/auth";
import menu from "./menu";

const { SubMenu } = Menu;

const { Header, Content, Footer, Sider } = Layout;

export const withLayout = (seletedKey) => (WrappedComponent) =>
  class extends React.Component {
    state = {
      collapsed: false,
      isLogOut: false,
    };

    onCollapse = (collapsed) => {
      console.log(collapsed);
      this.setState({ collapsed });
    };

    onLogOut = () => {
      clearUserToken();
      this.setState({
        isLogOut: true,
      });
    };

    render() {
      if (this.state.isLogOut) {
        return <Redirect to="/login" />;
      }
      const data = getUserData();
      return (
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
            theme="light"
          >
            <div className="logo">
              <img
                src="https://uet.vnu.edu.vn/wp-content/uploads/2019/03/logo-outline.png"
                alt=""
                style={{ width: 75 }}
              />
            </div>
            <Menu
              defaultSelectedKeys={[seletedKey]}
              style={{ lineHeight: "64px" }}
              defaultOpenKeys={["admin"]}
              mode="inline"
            >
              {data &&
                data.r === 1 &&
                menu.student.map((student) => {
                  return (
                    <Menu.Item key={student.key}>
                      <Link to={student.url}>
                        <span className="submenu-title-wrapper">
                          <Icon type={student.icon} />
                          {student.title}
                        </span>
                      </Link>
                    </Menu.Item>
                  );
                })}

              {data && data.r === 2 && (
                <SubMenu
                  title={
                    <span className="submenu-title-wrapper">
                      <Icon type="team" />
                      Admin
                    </span>
                  }
                  key="admin"
                >
                  {menu.admin.map((admin) => {
                    return (
                      <Menu.Item key={admin.key}>
                        <Link to={admin.url}>{admin.title}</Link>
                      </Menu.Item>
                    );
                  })}
                </SubMenu>
              )}
            </Menu>
          </Sider>

          <Layout className="layout">
            <Header style={{ background: "#fff", padding: 0 }}>
              <div className="header">
                <Button type="danger" onClick={this.onLogOut}>
                  Logout
                </Button>
              </div>
            </Header>
            <Content style={{ padding: "0 50px" }}>
              <div
                style={{
                  background: "#fff",
                  padding: 24,
                  minHeight: "calc(100vh - 64px - 79px)",
                  marginTop: 10,
                }}
              >
                <WrappedComponent {...this.props} />
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Knift ©2018 Created by Knift Team
            </Footer>
          </Layout>
        </Layout>
      );
    }
  };
