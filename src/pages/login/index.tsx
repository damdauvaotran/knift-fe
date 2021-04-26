import React, { useEffect, useState } from "react";
import { login } from "../../api/auth";
import { Form, Input, Button, Card, message } from "antd";
import { Link } from "react-router-dom";
import Icon from "@ant-design/icons";
import "./style.scss";
import cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { getUserData } from "../../utils/auth";
import { useDispatch } from "react-redux";
import { loginAction } from "../../redux/action/authAction";

const Login: React.FC = () => {
  const [isLoginSuccess, setIsLoginSuccess] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const history = useHistory();

  const dispatch = useDispatch();

  const handleSubmit = async (values: any) => {
    const res = await login({
      username: values.username,
      password: values.password,
    });
    if (res.success) {
      message.success("Đăng nhập thành công");
      cookies.set("kniftToken", res.data.token, { expires: 3 });

      setIsLoginSuccess(true);
      dispatch(loginAction(res.data.token));
      history.push("/");
    } else {
      message.error(res.message);
    }
  };

  useEffect(() => {}, [isLoginSuccess]);
  return (
    <div className="login-background">
      <Card style={{ width: 300 }}>
        <div>
          <div className="login-title">{t("app.title")}</div>
          <div>{t("app.slogan")}</div>
        </div>

        <Form
          onFinish={handleSubmit}
          className="login-form"
          name="normal_login"
          form={form}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              {t("page.login.button.login")}
            </Button>
          </Form.Item>
          <Form.Item>
            <Link to="/register"> {t("page.login.button.orRegister")}</Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
