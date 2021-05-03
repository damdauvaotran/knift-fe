import { FC, useEffect, useState } from "react";
import { Table, Button, Typography, Popconfirm, notification } from "antd";
import { deleteClass, getAllClass } from "../../api/class";
import { withLayout } from "../../shared-component/Layout/Layout";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./class.scss";
import {
  DeleteOutlined,
  FormOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { formatDate } from "../../utils/time";
import { getUserData } from "../../utils/auth";
import { ROLE } from "../../constant";

const { Text } = Typography;
const ClassList: FC = () => {
  const [classList, setClassList] = useState<any[]>([]);
  const history = useHistory();

  const { role } = getUserData();

  const { t } = useTranslation();
  useEffect(() => {
    fetchClass();
  }, []);

  const fetchClass = () => {
    getAllClass().then((data: any) => {
      console.log(data);
      if (data?.success) {
        setClassList(data.data.classes);
      }
    });
  };
  const columns = [
    {
      title: t("page.class.title"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("page.class.subject"),
      dataIndex: ["subject", "name"],
      key: "subjectName",
    },
    {
      title: t("start"),
      dataIndex: "startTime",
      key: "startTime",
      render: (text: string) => <Text>{formatDate(new Date(text))}</Text>,
    },
    {
      title: t("end"),
      dataIndex: "endTime",
      key: "endTime",
      render: (text: string) => <Text>{formatDate(new Date(text))}</Text>,
    },
    {
      title: t("action"),
      key: "action",
      dataIndex: "classId",
      render: (text: string, record: any) => (
        <div>
          <Button
            size="middle"
            type="primary"
            className="util-button"
            shape="circle"
            icon={<InfoCircleOutlined />}
            onClick={() => {
              redirectToClass(text);
            }}
          />
          {role === ROLE.teacher && (
            <Button
              size="middle"
              type="primary"
              className="util-button"
              shape="circle"
              icon={<FormOutlined />}
              onClick={() => {
                redirectToEditClass(text);
              }}
            />
          )}
          {role === ROLE.teacher && (
            <Popconfirm
              title={t("areYouSureToDelete")}
              onConfirm={() => deleteClassRoom(text)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                size="middle"
                type="primary"
                danger
                icon={<DeleteOutlined />}
                className="util-button"
                shape="circle"
              />
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  const redirectToClass = (classId: string) => {
    history.push(`/class/${classId}`);
  };

  const redirectToCreateClass = () => {
    history.push(`/class/create`);
  };

  const redirectToEditClass = (classId: string) => {
    history.push(`/class/${classId}/edit`);
  };

  const deleteClassRoom = async (text: string) => {
    const res = await deleteClass(text);
    console.log(res);
    if (res?.success) {
      notification.success({ message: t("deleteSuccess") });
      fetchClass();
    }
  };

  return (
    <div>
      <div className="create-wrapper">
        {role === ROLE.teacher && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={redirectToCreateClass}
          >
            {t("page.class.createClass")}
          </Button>
        )}
      </div>
      <Table rowKey="classId" columns={columns} dataSource={classList} />
    </div>
  );
};

export default withLayout("Danh sách lớp học")(ClassList);
