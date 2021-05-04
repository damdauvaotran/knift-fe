import { FC, useEffect, useState } from "react";
import {
  Table,
  Button,
  Typography,
  Popconfirm,
  notification,
  Tabs,
} from "antd";
import { useParams } from "react-router-dom";
import { withLayout } from "../../shared-component/Layout/Layout";
import { useHistory } from "react-router-dom";
import { deleteLesson, getAllLessonByClassId } from "../../api/lesson";
import {
  getAllStudentByClassId,
  deleteStudentFromClass,
} from "../../api/student";
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
import { limitToPagination, paginationToLimit } from "../../utils/pagination";

const { TabPane } = Tabs;
const { Text } = Typography;

const ClassInfo: FC = () => {
  const [lessonList, setLessonList] = useState<any[]>([]);
  const [studentList, setStudentList] = useState<any[]>([]);
  const [invitationVisible, setInvitationVisible] = useState<boolean>(false);
  const [lessonPagination, setLessonPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0,
  });
  const [studentPagination, setStudentPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0,
  });
  const history = useHistory();
  const { t } = useTranslation();
  // @ts-ignore
  const { id: classId } = useParams();

  const { role } = getUserData();

  useEffect(() => {
    fetchLesson(paginationToLimit(lessonPagination));
    fetchStudent(paginationToLimit(studentPagination));
  }, []);

  const fetchLesson = ({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }) => {
    getAllLessonByClassId(classId, { limit, offset }).then((data: any) => {
      console.log(data);
      if (data?.success) {
        setLessonList(data.data.lessons);
        setLessonPagination(
          limitToPagination({
            limit: data.data.limit,
            offset: data.data.offset,
            total: data.data.total,
          })
        );
      }
    });
  };
  const fetchStudent = ({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }) => {
    getAllStudentByClassId(classId, { limit, offset }).then((data: any) => {
      if (data?.success) {
        setStudentList(data.data.students);
      }
    });
  };
  const lessonColumns = [
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
      dataIndex: "lessonId",
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

  const studentColumns = [
    {
      title: t("name"),
      dataIndex: "displayName",
      key: "displayName",
    },
    {
      title: t("detail"),
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: t("action"),
      key: "action",
      dataIndex: "userId",
      render: (text: string, record: any) => (
        <div>
          {role === ROLE.teacher && (
            <Popconfirm
              title={t("areYouSureToDelete")}
              onConfirm={() => deleteStudentAndFetch(text)}
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

  const handleLessonTableChange = (pagination: any) => {
    const limitOffset = paginationToLimit(pagination);
    fetchLesson(limitOffset);
  };

  const handleStudentTableChange = (pagination: any) => {
    const limitOffset = paginationToLimit(pagination);
    fetchStudent(limitOffset);
  };

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
      fetchLesson(paginationToLimit(lessonPagination));
    }
  };

  const deleteStudentAndFetch = async (lessonId: string) => {
    const res = await deleteStudentFromClass(classId, lessonId);
    if (res?.success) {
      notification.success({ message: t("deleteSuccess") });
      fetchStudent(paginationToLimit(studentPagination));
    }
  };

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
        <Tabs defaultActiveKey="1">
          <TabPane tab={t("lesson")} key="lesson">
            <Table
              rowKey="lessonId"
              columns={lessonColumns}
              dataSource={lessonList}
              onChange={handleLessonTableChange}
              pagination={lessonPagination}
            />
          </TabPane>
          <TabPane tab={t("student")} key="student">
            <Table
              rowKey="studentId"
              columns={studentColumns}
              dataSource={studentList}
              onChange={handleStudentTableChange}
              pagination={studentPagination}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default withLayout("Thông tin lớp học")(ClassInfo);
