import { FC, useEffect, useState } from "react";
import { Table, Button } from "antd";
import { getAllClass } from "../../api/student/class";
import { withLayout } from "../../shared-component/Layout/Layout";
import { useHistory } from "react-router-dom";

const ClassList: FC = () => {
  const [classList, setClassList] = useState<any[]>([]);
  const history = useHistory();
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
            redirectToClass(text);
          }}
        >
          {text}
        </Button>
      ),
    },
  ];

  const redirectToClass = (classId: string) => {
    history.push(`/class/${classId}`);
  };
  return (
    <div>
      <Table rowKey="classId" columns={columns} dataSource={classList}></Table>
    </div>
  );
};

export default withLayout("1")(ClassList);
