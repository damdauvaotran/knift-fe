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
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { ICreateLesson, createLesson } from "../../api/lesson";

const { Option } = Select;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
};

const CreateLesson: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  useEffect(() => {}, []);

  // @ts-ignore
  const { classId } = useParams();

  const onFinishFailed = () => {};
  const onFinish = async (data: ICreateLesson) => {
    console.log(data);
    const res = await createLesson({
      name: data.name,
      endTime: moment(data.endTime).valueOf(),
      startTime: moment(data.startTime).valueOf(),
      detail: data.detail,
      classId: parseInt(classId, 10),
    });
    if (res?.success) {
      notification.success({
        message: t("createLessonSuccess"),
      });
      history.push(`/class/${classId}`);
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
          label={t("lessonName")}
          name="name"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t("detail")}
          name="detail"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.TextArea />
        </Form.Item>
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

export default withLayout("Tạo buổi học")(CreateLesson);
