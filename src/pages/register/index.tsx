import React from "react";
import { register } from "../../api/auth";
import { Form, Input, Button, Card, message } from "antd";
import Icon from "@ant-design/icons";
import "./style.scss";

import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const history = useHistory();

  const handleSubmit = async (values: any) => {
    try {
      const res = await register({
        username: values.username,
        password: values.password,
        displayName: values.name,
        gender: "MALE",
        email: "a@gmail.com",
      });
      console.log("res", res);
      if (res.success) {
        message.success("Đăng ký thành công");
        history.push("/login");
      } else {
        message.error(res.message);
      }
    } catch (e) {}
  };
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
          name="normal_register"
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
          <Form.Item
            name="repeatPassword"
            rules={[
              {
                required: true,
                message: "Please repeat your password",
              },
            ]}
          >
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Repeat Password"
            />
          </Form.Item>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter your name ",
              },
            ]}
          >
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="test"
              placeholder="Name"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              {t("page.register.button.register")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
