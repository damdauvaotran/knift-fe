import { FC, useEffect, useState } from "react";
import { Table, Button, Typography } from "antd";
import { useParams } from "react-router-dom";
import { withLayout } from "../../shared-component/Layout/Layout";
import { useHistory } from "react-router-dom";
import { getAllLessonByClassId } from "../../api/student/lesson";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../utils/time";
import { PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ClassInfo: FC = () => {
  const [lessonList, setLessonList] = useState<any[]>([]);
  const history = useHistory();
  const { t } = useTranslation();
  // @ts-ignore
  const { id: classId } = useParams();
  useEffect(() => {
    getAllLessonByClassId(classId).then((data: any) => {
      console.log(data);
      if (data?.success) {
        setLessonList(data.data.lessons);
      }
    });
  }, []);
  const columns = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("detail"),
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: t("start"),
      dataIndex: "startTime",
      key: "startTime",
      render: (text: string) => {
        return <Text>{formatDate(new Date(text))}</Text>;
      },
    },
    {
      title: t("end"),
      dataIndex: "endTime",
      key: "endTime",
      render: (text: string) => {
        return <Text>{formatDate(new Date(text))}</Text>;
      },
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
            redirectToLesson(text);
          }}
        >
          Go
        </Button>
      ),
    },
  ];

  const redirectToLesson = (lessonId: string) => {
    history.push(`/lesson/${lessonId}`);
  };

  const redirectToCreateLesson = () => {
    history.push(`/class/${classId}/lesson/create`);
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={redirectToCreateLesson}
      >
        {t("page.class.createClass")}
      </Button>
      <Table rowKey="lessonId" columns={columns} dataSource={lessonList} />
    </div>
  );
};

export default withLayout("Thông tin lớp học")(ClassInfo);
