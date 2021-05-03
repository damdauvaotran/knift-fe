import { FC, useEffect, useState } from "react";
import { Table, Button, Typography, Popconfirm, notification } from "antd";
import { useParams } from "react-router-dom";
import { withLayout } from "../../shared-component/Layout/Layout";
import { useHistory } from "react-router-dom";
import { deleteLesson, getAllLessonByClassId } from "../../api/lesson";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../utils/time";
import {
  DeleteOutlined,
  FormOutlined,
  MailOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "./classInfo.scss";
import CreateInvitation from "./createInvitationModel";
import { ROLE } from "../../constant";
import { getUserData } from "../../utils/auth";
const { Text } = Typography;

const ClassInfo: FC = () => {
  const [lessonList, setLessonList] = useState<any[]>([]);
  const [invitationVisible, setInvitationVisible] = useState<boolean>(false);
  const history = useHistory();
  const { t } = useTranslation();
  // @ts-ignore
  const { id: classId } = useParams();

  const { role } = getUserData();

  useEffect(() => {
    fetchLesson();
  }, []);

  const fetchLesson = () => {
    getAllLessonByClassId(classId).then((data: any) => {
      console.log(data);
      if (data?.success) {
        setLessonList(data.data.lessons);
      }
    });
  };
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
        <div>
          <Button
            size="middle"
            type="primary"
            onClick={() => {
              redirectToLesson(text);
            }}
          >
            Go
          </Button>
          {role === ROLE.teacher && (
            <Button
              size="middle"
              type="primary"
              className="util-button"
              shape="circle"
              icon={<FormOutlined />}
              onClick={() => {
                redirectToEditLesson(text);
              }}
            />
          )}
          {role === ROLE.teacher && (
            <Popconfirm
              title={t("areYouSureToDelete")}
              onConfirm={() => deleteLessonAndFetch(text)}
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

  const redirectToLesson = (lessonId: string) => {
    history.push(`/lesson/${lessonId}`);
  };

  const redirectToCreateLesson = () => {
    history.push(`/class/${classId}/lesson/create`);
  };

  const redirectToEditLesson = (lessonId: string) => {
    history.push(`/lesson/${lessonId}/edit`);
  };

  const deleteLessonAndFetch = async (lessonId: string) => {
    const res = await deleteLesson(lessonId);
    if (res?.success) {
      notification.success({ message: t("deleteSuccess") });
      fetchLesson();
    }
  };

  const createInvitation = () => {};

  return (
    <div id="class-info">
      <div className="create-wrapper">
        {role === ROLE.teacher && (
          <CreateInvitation
            visible={invitationVisible}
            setVisible={setInvitationVisible}
            classId={classId}
          />
        )}

        {role === ROLE.teacher && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={redirectToCreateLesson}
            className="function-button"
          >
            {t("createLesson")}
          </Button>
        )}
      </div>

      <div>
        <Table rowKey="lessonId" columns={columns} dataSource={lessonList} />
      </div>
    </div>
  );
};

export default withLayout("Thông tin lớp học")(ClassInfo);
