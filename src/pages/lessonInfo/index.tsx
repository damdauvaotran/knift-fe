import { FC, useEffect, useState } from "react";
import { Table, Button, Typography } from "antd";
import { withLayout } from "../../shared-component/Layout/Layout";
import { useHistory, useParams } from "react-router-dom";
import { saveAs } from "file-saver";
import {
  getAllConferenceWithLessonId,
  getAttendanceList,
} from "../../api/student/conference";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { formatDate } from "../../utils/time";
import {
  DownloadOutlined,
  FundProjectionScreenOutlined,
  PlusOutlined,
} from "@ant-design/icons";

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
      title: "STT",
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
        <div>
          <Button
            size="middle"
            type="primary"
            onClick={() => {
              redirectToConferencePlayer(text);
            }}
            icon={<FundProjectionScreenOutlined />}
            className="util-button"
          >
            {t("join")}
          </Button>
          <Button
            size="middle"
            type="primary"
            onClick={async () => {
              const res = await downloadAttendanceList(text);
              console.log(typeof res.data);
              const dirtyFileName = res.headers["content-disposition"];
              const regex = /filename[^;=\n]*=(?:(\\?['"])(.*?)\1|(?:[^\s]+'.*?')?([^;\n]*))/;
              const fileName = dirtyFileName.match(regex)[2];
              console.log(fileName);
              const blob = new Blob([res.data], {
                type:
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              });
              saveAs(blob, fileName);
            }}
            className="util-button"
            download
            icon={<DownloadOutlined />}
          >
            {t("attendanceList")}
          </Button>
        </div>
      ),
    },
  ];

  const redirectToConferencePlayer = (conferenceId: string) => {
    history.push(`/conference/${conferenceId}`);
  };

  const redirectToCreateConference = () => {
    history.push(`/lesson/${id}/conference/create`);
  };

  const downloadAttendanceList = async (conferenceId: string) => {
    return await getAttendanceList(conferenceId);
  };

  return (
    <div>
      <div className="create-wrapper">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={redirectToCreateConference}
        >
          {t("createConference")}
        </Button>
      </div>
      <Table rowKey="conferenceId" columns={columns} dataSource={confList} />
    </div>
  );
};

export default withLayout("Các buổi gặp mặt trực tuyến")(LessonInfo);
