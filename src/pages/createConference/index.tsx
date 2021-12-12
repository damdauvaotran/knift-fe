import { FC, useEffect, useState } from "react";
import {
  Form,
  Table,
  Select,
  Input,
  Button,
  Checkbox,
  Row,
  Col,
  DatePicker,
  notification,
} from "antd";
import { useTranslation } from "react-i18next";
import { withLayout } from "../../shared-component/Layout/Layout";
import { getAllSubject } from "../../api/subject";
import { ICreateConference, createConference } from "../../api/conference";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";

const { Option } = Select;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
};

export interface ISubject {
  subjectId: number;
  name: string;
}

const CreateConference: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  // @ts-ignore
  const { lessonId } = useParams();

  const onFinishFailed = () => {};

  const onFinish = async (data: ICreateConference) => {
    console.log(data);
    const res = await createConference({
      endTime: moment(data.endTime).valueOf(),
      startTime: moment(data.startTime).valueOf(),
      lessonId: parseInt(lessonId, 10),
    });
    console.log(res);
    if (res?.success) {
      await notification.success({
        message: t("createConferenceSuccess"),
      });
      history.push(`/lesson/${lessonId}`);
    }
  };

  return (
    <div>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        {...layout}
      >
        <Form.Item
          label={t("start")}
          name="startTime"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item
          label={t("end")}
          name="endTime"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default withLayout("Tạo buổi gặp mặt")(CreateConference);
