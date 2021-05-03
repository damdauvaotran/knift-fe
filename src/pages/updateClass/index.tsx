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
import {
  ICreateClass,
  getClassById,
  updateClass,
  IUpdateClass,
} from "../../api/class";
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

const CreateClass: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [subjectList, setSubjectList] = useState<ISubject[]>();
  const [form] = Form.useForm();

  // @ts-ignore
  const { id: classId } = useParams();

  useEffect(() => {
    getAllSubject().then((data) => {
      const subjectList = data?.data?.subjects;
      if (subjectList && Array.isArray(subjectList)) {
        setSubjectList(subjectList);
      }
    });

    fetchClassInfo();
  }, []);

  const fetchClassInfo = async () => {
    const res = await getClassById(classId);
    if (res?.success) {
      const classInfo = res?.data?.class;
      form.setFieldsValue({
        name: classInfo?.name,
        detail: classInfo?.detail,
        subjectId: classInfo?.subjectId,
        startTime: moment(classInfo?.startTime),
        endTime: moment(classInfo?.endTime),
      });
    }
  };

  const onFinishFailed = () => {};
  const onFinish = async (data: IUpdateClass) => {
    const res = await updateClass(classId, {
      name: data.name,
      endTime: moment(data.endTime).unix(),
      startTime: moment(data.startTime).unix(),
      detail: data.detail,
      subjectId: data.subjectId,
    });
    if (res?.success) {
      await notification.success({
        message: t("updateSuccess"),
      });
      history.push("/class");
    }
  };

  return (
    <div>
      <Form
        name="basic"
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        {...layout}
      >
        <Form.Item
          label={t("className")}
          name="name"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t("subject")}
          name="subjectId"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Select>
            {subjectList?.map((subject) => (
              <Option value={subject.subjectId}>{subject.name}</Option>
            ))}
          </Select>
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

export default withLayout("Cập nhật thông tin lớp")(CreateClass);
