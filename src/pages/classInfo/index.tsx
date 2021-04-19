import { FC, useEffect, useState } from "react";
import { Table, Button } from "antd";
import { withLayout } from "../../shared-component/Layout/Layout";
import { useHistory } from "react-router-dom";
import { getAllLesson } from "../../api/student/lesson";

const ClassInfo: FC = () => {
  const [lessonList, setLessonList] = useState<any[]>([]);
  const history = useHistory();
  useEffect(() => {
    getAllLesson().then((data: any) => {
      console.log(data);
      if (data?.success) {
        setLessonList(data.data.lessons);
      }
    });
  }, []);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "subjectName",
      dataIndex: ["subject", "name"],
      key: "subjectName",
    },
    {
      title: "startTime",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "endTime",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "action",
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
      <Table rowKey="classId" columns={columns} dataSource={lessonList}></Table>
    </div>
  );
};

export default withLayout("1")(ClassInfo);
