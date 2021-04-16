import React from "react";
import moment from "moment";
import {
  Table,
  Divider,
  Button,
  Row,
  Modal,
  Form,
  Popconfirm,
  message,
  Select,
  DatePicker,
  TimePicker,
} from "antd";
import { withRouter } from "react-router-dom";
import { withLayout } from "../../../shared-component/Layout/Layout";
import {
  getAllShiftWithSemester,
  createShiftWithSemester,
  updateShiftWithSemester,
  deleteShiftWithSemester,
  importShift,
  getRegisteredStudentWithSemester,
} from "../../../api/admin/shift";
import { getAllSubject } from "../../../api/admin/subject";
import { getAllRoom } from "../../../api/admin/room";
import { getSemesterById } from "../../../api/admin/semester";

const { Option } = Select;

class ShiftManager extends React.Component {
  state = {
    shiftList: [],
    isCreateModalVisible: false,
    isEditModalVisible: false,
    createdShift: {},
    updatedShift: {},
    selectedShift: {},
    file: null,
    fileList: [],
    roomList: [],
    subjectList: [],
    semester: {},
  };

  fetchShift = async () => {
    const res = await getAllShiftWithSemester(this.getSemesterId());
    const res2 = await getRegisteredStudentWithSemester(this.getSemesterId());
    if (res.success && res2.success) {
      this.setState({
        shiftList: res.data.shiftList.map((shift, index) => {
          const studentList = res2.data.shiftList[index].examRegistrations.map(
            (registration) => registration.user
          );
          return { ...shift, studentList };
        }),
      });
    } else {
      message.error(res.message);
    }
  };

  fetchSemesterById = async (semesterId) => {
    const res = await getSemesterById(semesterId);
    if (res.success) {
      console.log("semester", res.data);
      this.setState({
        semester: res.data.semester,
      });
    }
  };

  fetchSubject = async () => {
    const res = await getAllSubject();
    if (res.success) {
      this.setState({
        subjectList: res.data.subjectList,
      });
    } else {
      message.error(res.message);
    }
  };

  fetchRoom = async () => {
    const res = await getAllRoom();
    if (res.success) {
      this.setState({
        roomList: res.data.roomList,
      });
    } else {
      message.error(res.message);
    }
  };

  getSemesterId = () => {
    // return this.state.semester.semesterId
    return this.props.match.params.id;
  };

  columns = [
    {
      title: "Phòng",
      dataIndex: "room.roomName",
      key: "roomName",
    },
    {
      title: "Môn",
      dataIndex: "subject.subjectName",
      key: "subjectName",
    },
    {
      title: "Ngày",
      dataIndex: "examDate",
      key: "examDate",
    },
    {
      title: "Bắt đầu",
      dataIndex: "from",
      key: "from",
    },
    {
      title: "Chỗ",
      key: "slot",
      render: (text, record) => {
        return (
          <div>
            {/* {JSON.stringify(record)} */}
            {`${record.registered}/${record.room.totalSlot}`}
          </div>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => {
        return (
          <span>
            <Divider type="vertical" />
            <Button
              type="primary"
              icon="edit"
              onClick={() => this.handleOpenEditModal(record)}
            >
              Sửa
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title="Bạn có thật sự muốn xóa"
              onConfirm={() => this.handleDeleteShift(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="danger" icon="delete">
                Xóa
              </Button>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  handleDeleteShift = async (shift) => {
    const { examShiftId } = shift;
    const res = await deleteShiftWithSemester(
      this.getSemesterId(),
      examShiftId
    );
    if (res.success) {
      message.success("Xóa thành công");
      await this.fetchShift();
    } else {
      message.error(res.message);
    }
  };

  handleOpenCreateModal = () => {
    this.setState({ isCreateModalVisible: true });
  };

  handleOpenEditModal = (selectedShift) => {
    this.setState({
      isEditModalVisible: true,
      selectedShift,
    });
  };

  handleCreateShift = () => {
    this.props.form.validateFields(
      [
        "createdShiftRoom",
        "createdShiftSubject",
        "createdShiftDate",
        "createdShiftFrom",
      ],
      async (errors, values) => {
        if (!errors) {
          try {
            const {
              createdShiftRoom,
              createdShiftSubject,
              createdShiftDate,
              createdShiftFrom,
            } = values;
            const formatDate = createdShiftDate.format("DD/MM/YYYY");
            const formatFrom = createdShiftFrom.format("HH:mm");
            const res = await createShiftWithSemester(
              this.getSemesterId(),
              createdShiftRoom,
              createdShiftSubject,
              formatDate,
              formatFrom
            );
            if (res.success) {
              message.success("Thêm thành công");
              this.handleCloseCreateModal();
              this.fetchShift();
            } else {
              message.error(res.message);
            }
          } catch (e) {
            message.error(e);
          }
        }
      }
    );
  };

  handleEditShift = () => {
    this.props.form.validateFields(
      [
        "updatedShiftRoom",
        "updatedShiftSubject",
        "updatedShiftDate",
        "updatedShiftFrom",
      ],
      async (errors, values) => {
        if (!errors) {
          try {
            const { examShiftId } = this.state.selectedShift;
            const {
              updatedShiftRoom,
              updatedShiftSubject,
              updatedShiftDate,
              updatedShiftFrom,
            } = values;
            const formatDate = updatedShiftDate.format("DD/MM/YYYY");
            const formatFrom = updatedShiftFrom.format("HH:mm");
            const res = await updateShiftWithSemester(
              this.getSemesterId(),
              examShiftId,
              updatedShiftRoom,
              updatedShiftSubject,
              formatDate,
              formatFrom
            );
            if (res.success) {
              message.success("Sửa thành công");
              this.handleCloseEditModal();
              this.fetchShift();
            } else {
              message.error(res.message);
            }
          } catch (e) {
            message.error(e);
          }
        }
      }
    );
  };

  handleCloseCreateModal = () => {
    this.setState({
      isCreateModalVisible: false,
    });
  };

  handleCloseEditModal = () => {
    this.setState({
      isEditModalVisible: false,
      selectedShift: {},
    });
  };

  componentDidMount = () => {
    this.fetchSemesterById(this.props.match.params.id);
    this.fetchShift();
    this.fetchSubject();
    this.fetchRoom();
  };

  handleUploadFile = (info) => {
    // if (info.file.status !== 'uploading') {
    //   console.log(info.file, info.fileList);
    // }
    // if (info.file.status === 'done') {
    //   message.success(`${info.file.name} file uploaded successfully`);
    // } else if (info.file.status === 'error') {
    //   message.error(`${info.file.name} file upload failed.`);
    // }

    let fileList = [...info.fileList];
    // 1. Limit the number of uploaded files
    // Only to show one recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);

    // 2. Read from response and show file link

    this.setState({ fileList });
  };

  uploadFile = async (options) => {
    const { onSuccess, onError, file } = options;
    const fmData = new FormData();
    fmData.append("shifts", file);
    try {
      const res = await importShift(fmData);
      onSuccess("Ok");
      if (res.success) {
        message.success("Import thành công");
        await this.fetchShift();
      } else {
        message.error(JSON.stringify(res.message));
      }
    } catch (e) {
      console.error(e);
      onError({ err: e });
    }
  };

  render() {
    console.log("shift", this.state.shiftList);
    console.log("props", this.props);
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    const {
      shiftList,
      isCreateModalVisible,
      isEditModalVisible,
      selectedShift,
      roomList,
      subjectList,
      semester,
    } = this.state;
    return (
      <div>
        <Row>
          <h3>{semester && semester.semesterName}</h3>
        </Row>
        <Row style={{ display: "flex", justifyContent: "flex-end" }}>
          {/* <Upload onChange={this.handleUploadFile} customRequest={this.uploadFile} fileList={fileList}> */}
          {/*  <Button type='primary' icon='file-excel'>Import </Button> */}
          {/* </Upload> */}
          <Divider type="vertical" />
          <Button
            type="primary"
            icon="folder-add"
            onClick={this.handleOpenCreateModal}
          >
            Thêm{" "}
          </Button>
        </Row>
        <Row>
          <Table
            dataSource={shiftList}
            columns={this.columns}
            rowKey={(record) => record.examShiftId}
          />
        </Row>
        <Modal
          title="Thêm ca"
          visible={isCreateModalVisible}
          onOk={this.handleCreateShift}
          onCancel={this.handleCloseCreateModal}
        >
          <Form {...formItemLayout}>
            <Form.Item label="Phòng" hasFeedback>
              {getFieldDecorator("createdShiftRoom", {
                rules: [
                  {
                    required: true,
                    message: "Hãy nhập tên ca",
                  },
                ],
              })(
                <Select style={{ width: "100%" }}>
                  {roomList.map((room) => (
                    <Option key={room.roomId} value={room.roomId}>
                      {room.roomName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Môn" hasFeedback>
              {getFieldDecorator("createdShiftSubject", {
                rules: [
                  {
                    required: true,
                    message: "Hãy nhập tên ca",
                  },
                ],
              })(
                <Select style={{ width: "100%" }}>
                  {subjectList.map((subject) => (
                    <Option key={subject.subjectId} value={subject.subjectId}>
                      {subject.subjectName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Ngày" hasFeedback>
              {getFieldDecorator("createdShiftDate", {
                rules: [
                  {
                    required: true,
                    message: "Hãy nhập tên ca",
                  },
                ],
              })(<DatePicker />)}
            </Form.Item>
            <Form.Item label="Bắt đầu" hasFeedback>
              {getFieldDecorator("createdShiftFrom", {
                rules: [
                  {
                    required: true,
                    message: "Hãy nhập thời gian bắt đầu",
                  },
                ],
              })(<TimePicker format="HH:mm" />)}
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Sửa"
          visible={isEditModalVisible}
          onOk={this.handleEditShift}
          onCancel={this.handleCloseEditModal}
        >
          {/* Update Form */}
          <Form {...formItemLayout}>
            <Form.Item label="Phòng" hasFeedback>
              {getFieldDecorator("updatedShiftRoom", {
                initialValue:
                  selectedShift &&
                  selectedShift.room &&
                  selectedShift.room.roomId,
                rules: [
                  {
                    required: true,
                    message: "Hãy nhập tên ca",
                  },
                ],
              })(
                <Select style={{ width: "100%" }}>
                  {roomList.map((room) => (
                    <Option key={room.roomId} value={room.roomId}>
                      {room.roomName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Môn" hasFeedback>
              {getFieldDecorator("updatedShiftSubject", {
                initialValue:
                  selectedShift &&
                  selectedShift.subject &&
                  selectedShift.subject.subjectId,
                rules: [
                  {
                    required: true,
                    message: "Hãy nhập tên ca",
                  },
                ],
              })(
                <Select style={{ width: "100%" }}>
                  {subjectList.map((subject) => (
                    <Option key={subject.subjectId} value={subject.subjectId}>
                      {subject.subjectName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Ngày" hasFeedback>
              {getFieldDecorator("updatedShiftDate", {
                initialValue:
                  selectedShift &&
                  selectedShift.examDate &&
                  moment(selectedShift.examDate, "DD/MM/YYYY"),
                rules: [
                  {
                    required: true,
                    message: "Hãy nhập tên ca",
                  },
                ],
              })(<DatePicker />)}
            </Form.Item>
            <Form.Item label="Bắt đầu" hasFeedback>
              {getFieldDecorator("updatedShiftFrom", {
                initialValue:
                  selectedShift &&
                  selectedShift.from &&
                  moment(selectedShift.from, "HH:mm"),
                rules: [
                  {
                    required: true,
                    message: "Hãy nhập thời gian bắt đầu",
                  },
                ],
              })(<TimePicker format="HH:mm" />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default withRouter(
  withLayout("admin4")(Form.create({ name: "register" })(ShiftManager))
);
