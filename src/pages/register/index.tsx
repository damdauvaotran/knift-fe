import React from "react";
import { register } from "../../api/auth";
import { Form, Input, Button, Card, message, Select } from "antd";
import Icon from "@ant-design/icons";
import "./style.scss";

import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";

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
        gender: values.gender,
        email: values.email,
        roleId: values.roleId,
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
            rules={[
              { required: true, message: t("fieldIsRequired") },
              { min: 6, message: t("usernameToShort") },
            ]}
          >
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: t("fieldIsRequired") },
              { min: 6, message: t("passwordToShort") },
            ]}
          >
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            name="repeatPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: t("fieldIsRequired"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t("passwordNotMatch")));
                },
              }),
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
                message: t("fieldIsRequired"),
              },
            ]}
          >
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="test"
              placeholder="Name"
            />
          </Form.Item>
          <Form.Item
            name="gender"
            rules={[
              {
                required: true,
                message: t("fieldIsRequired"),
              },
            ]}
          >
            <Select placeholder={t("gender")}>
              <Select.Option value={"MALE"}>{t("male")}</Select.Option>
              <Select.Option value={"FEMALE"}>{t("female")}</Select.Option>
              <Select.Option value={"OTHER"}>{t("other")}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: t("fieldIsRequired"),
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="roleId"
            rules={[
              {
                required: true,
                message: t("fieldIsRequired"),
              },
            ]}
          >
            <Select placeholder={t("youAre")}>
              <Select.Option value={1}>{t("student")}</Select.Option>
              <Select.Option value={2}>{t("teacher")}</Select.Option>
            </Select>
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
          <Form.Item>
            <span style={{ marginRight: 5 }}>
              {t("page.register.button.orLogin")}
            </span>
            <Link to="/login"> {t("page.login.title")}</Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
