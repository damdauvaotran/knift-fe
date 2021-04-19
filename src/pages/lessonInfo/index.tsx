import { FC, useEffect, useState } from "react";
import { Table, Button } from "antd";
import { withLayout } from "../../shared-component/Layout/Layout";
import { useHistory } from "react-router-dom";
import { getAllConference } from "../../api/student/conference";

const LessonInfo: FC = () => {
  const [confList, setConfList] = useState<any[]>([]);
  const history = useHistory();
  useEffect(() => {
    getAllConference().then((data: any) => {
      console.log(data);
      if (data?.success) {
        setConfList(data.data.conferences);
      }
    });
  }, []);
  const columns = [
    {
      title: "ID",
      dataIndex: "conferenceId",
      key: "id",
    },
    {
      title: "status",
      dataIndex: "status",
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
      dataIndex: "conferenceId",
      render: (text: string, record: any) => (
        <Button
          size="middle"
          type="primary"
          onClick={() => {
            redirectToConferencePlayer(text);
          }}
        >
          {text}
        </Button>
      ),
    },
  ];

  const redirectToConferencePlayer = (conferenceId: string) => {
    history.push(`/conference/${conferenceId}`);
  };

  return (
    <div>
      <Table
        rowKey="conferenceId"
        columns={columns}
        dataSource={confList}
      ></Table>
    </div>
  );
};

export default withLayout("1")(LessonInfo);
