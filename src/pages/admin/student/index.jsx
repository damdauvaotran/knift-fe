import React from "react";
import {
  Table,
  Divider,
  Button,
  Row,
  Modal,
  Input,
  Form,
  Popconfirm,
  message,
  Upload,
} from "antd";
import { withLayout } from "../../../shared-component/Layout/Layout";
import {
  getAllStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  importStudent,
} from "../../../api/admin/student";

class StudentManager extends React.Component {
  state = {
    studentList: [],
    isCreateModalVisible: false,
    isEditModalVisible: false,
    createdStudent: {},
    updatedStudent: {},
    selectedStudent: {},
    file: null,
    fileList: [],
  };

  fetchStudent = async () => {
    const res = await getAllStudent();
    if (res.success) {
      this.setState({
        studentList: res.data.studentList,
      });
    } else {
      message.error(res.message);
    }
  };

  columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "MSSV",
      dataIndex: "mssv",
      key: "mssv",
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <span>
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
            onConfirm={() => this.handleDeleteStudent(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon="delete">
              Xóa
            </Button>
          </Popconfirm>
          ,
        </span>
      ),
    },
  ];

  handleDeleteStudent = async (student) => {
    const { userId } = student;
    const res = await deleteStudent(userId);
    if (res.success) {
      message.success("Xóa thành công");
      await this.fetchStudent();
    } else {
      message.error(res.message);
    }
  };

  handleOpenCreateModal = () => {
    this.setState({ isCreateModalVisible: true });
  };

  handleOpenEditModal = (selectedStudent) => {
    this.setState({
      isEditModalVisible: true,
      selectedStudent,
    });
  };

  handleCreateStudent = () => {
    this.props.form.validateFields(
      ["createdStudentName", "createdStudentCredit"],
      async (errors, values) => {
        if (!errors) {
          const res = await createStudent(
            values.createdStudentName,
            parseInt(values.createdStudentCredit, 10)
          );
          if (res.success) {
            message.success("Thêm thành công");
            this.handleCloseCreateModal();
            await this.fetchStudent();
          } else {
            message.error(res.message);
          }
        }
      }
    );
  };

  handleEditStudent = () => {
    this.props.form.validateFields(
      ["updatedStudentName", "updatedStudentCredit"],
      async (errors, values) => {
        if (!errors) {
          const { studentId } = this.state.selectedStudent;
          const res = await updateStudent(
            studentId,
            values.updatedStudentName,
            parseInt(values.updatedStudentCredit, 10)
          );
          if (res.success) {
            message.success("Sửa thành công");
            this.handleCloseEditModal();
            await this.fetchStudent();
          } else {
            message.error(res.message);
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
      selectedStudent: {},
    });
  };

  componentDidMount = async () => {
    await this.fetchStudent();
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
    fmData.append("students", file);
    try {
      const res = await importStudent(fmData);
      onSuccess("Ok");
      if (res.success) {
        message.success("Import thành công");
        await this.fetchStudent();
      } else {
        message.error(JSON.stringify(res.message));
      }
    } catch (e) {
      console.error(e);
      onError({ err: e });
    }
  };

  render() {
    console.log("student", this.state.studentList);
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
      studentList,
      isCreateModalVisible,
      isEditModalVisible,
      selectedStudent,
      fileList,
    } = this.state;
    return (
      <div>
        <Row style={{ display: "flex", justifyContent: "flex-end" }}>
          <Upload
            onChange={this.handleUploadFile}
            customRequest={this.uploadFile}
            fileList={fileList}
          >
            <Button type="primary" icon="file-excel">
              Import{" "}
            </Button>
          </Upload>
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
            dataSource={studentList}
            columns={this.columns}
            rowKey={(record) => record.userId}
          />
          ;
        </Row>
        <Modal
          title="Thêm phòng"
          visible={isCreateModalVisible}
          onOk={this.handleCreateStudent}
          onCancel={this.handleCloseCreateModal}
        >
          <Form {...formItemLayout}>
            <Form.Item label="Tên" hasFeedback>
              {getFieldDecorator("createdStudentName", {
                rules: [
                  {
                    required: true,
                    message: "Hãy nhập tên",
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="MSSV" hasFeedback>
              {getFieldDecorator("createdStudentMSSV", {
                rules: [
                  {
                    required: true,
                    message: "Hãy nhập MSSV",
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Sửa"
          visible={isEditModalVisible}
          onOk={this.handleEditStudent}
          onCancel={this.handleCloseEditModal}
        >
          <Form {...formItemLayout}>
            <Form.Item label="Tên" hasFeedback>
              {getFieldDecorator("updatedStudentName", {
                initialValue: selectedStudent && selectedStudent.name,
                rules: [
                  {
                    required: true,
                    message: "Hãy nhập tên phòng",
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="MSSV" hasFeedback>
              {getFieldDecorator("updatedStudentCredit", {
                initialValue: selectedStudent && selectedStudent.mssv,
                rules: [
                  {
                    required: true,
                    message: "Hãy nhập số chỗ ngồi",
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default withLayout("admin3")(
  Form.create({ name: "register" })(StudentManager)
);
