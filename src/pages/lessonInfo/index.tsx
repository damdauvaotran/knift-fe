import { FC, useEffect, useState } from "react";
import { Table, Button, Typography } from "antd";
import { withLayout } from "../../shared-component/Layout/Layout";
import { useHistory, useParams } from "react-router-dom";

import { getAllConferenceWithLessonId } from "../../api/student/conference";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { formatDate } from "../../utils/time";

const { Text } = Typography;

const LessonInfo: FC = () => {
  const [confList, setConfList] = useState<any[]>([]);
  const history = useHistory();
  const { t } = useTranslation();
  // @ts-ignore
  const { id } = useParams();
  useEffect(() => {
    getAllConferenceWithLessonId(id).then((data: any) => {
      console.log(data);
      if (data?.success) {
        setConfList(data.data.conferences);
      }
    });
  }, []);
  const columns = [
    {
      title: "s",
      dataIndex: "conferenceId",
      key: "id",
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "subjectName",
    },
    {
      title: t("start"),
      dataIndex: "startTime",
      key: "startTime",
      render: (text: string) => <Text>{formatDate(new Date(text))}</Text>,
    },
    {
      title: t("start"),
      dataIndex: "endTime",
      key: "endTime",
      render: (text: string) => <Text>{formatDate(new Date(text))}</Text>,
    },
    {
      title: t("action"),
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
          {t("join")}
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