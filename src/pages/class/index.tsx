import { FC, useEffect, useState } from "react";
import { Table, Button, Typography } from "antd";
import { getAllClass } from "../../api/student/class";
import { withLayout } from "../../shared-component/Layout/Layout";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./class.scss";
import { PlusOutlined } from "@ant-design/icons";
import { formatDate } from "../../utils/time";

const { Text } = Typography;
const ClassList: FC = () => {
  const [classList, setClassList] = useState<any[]>([]);
  const history = useHistory();

  const { t } = useTranslation();
  useEffect(() => {
    getAllClass().then((data: any) => {
      console.log(data);
      if (data?.success) {
        setClassList(data.data.classes);
      }
    });
  }, []);
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
        <Button
          size="middle"
          type="primary"
          onClick={() => {
            redirectToClass(text);
          }}
        >
          {t("detail")}
        </Button>
      ),
    },
  ];

  const redirectToClass = (classId: string) => {
    history.push(`/class/${classId}`);
  };

  const redirectToCreateClass = () => {
    history.push(`/class/create`);
  };

  return (
    <div>
      <div className="create-wrapper">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={redirectToCreateClass}
        >
          {t("page.class.createClass")}
        </Button>
      </div>
      <Table rowKey="classId" columns={columns} dataSource={classList} />
    </div>
  );
};

export default withLayout("1")(ClassList);
