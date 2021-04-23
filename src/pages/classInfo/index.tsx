import { FC, useEffect, useState } from "react";
import { Table, Button, Typography } from "antd";
import { useParams } from "react-router-dom";
import { withLayout } from "../../shared-component/Layout/Layout";
import { useHistory } from "react-router-dom";
import { getAllLessonByClassId } from "../../api/student/lesson";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../utils/time";

const { Text } = Typography;

const ClassInfo: FC = () => {
  const [lessonList, setLessonList] = useState<any[]>([]);
  const history = useHistory();
  const { t } = useTranslation();
  // @ts-ignore
  const { id } = useParams();
  useEffect(() => {
    getAllLessonByClassId(id).then((data: any) => {
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

  return (
    <div>
      <Table
        rowKey="lessonId"
        columns={columns}
        dataSource={lessonList}
      ></Table>
    </div>
  );
};

export default withLayout("1")(ClassInfo);
