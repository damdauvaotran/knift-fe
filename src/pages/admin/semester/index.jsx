import React from "react";
import { withRouter } from "react-router-dom";
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
  Switch,
} from "antd";
import { withLayout } from "../../../shared-component/Layout/Layout";
import {
  getAllSemester,
  createSemester,
  updateSemester,
  deleteSemester,
} from "../../../api/admin/semester";

class SemesterManager extends React.Component {
  state = {
    semesterList: [],
    isCreateModalVisible: false,
    isEditModalVisible: false,
    createdSemester: {},
    updatedSemester: {},
    selectedSemester: {},
    file: null,
    fileList: [],
  };

  fetchSemester = async () => {
    const res = await getAllSemester();
    this.setState({
      semesterList: res.data.semesterList,
    });
  };

  columns = [
    {
      title: "Tên kỳ thi ",
      dataIndex: "semesterName",
      key: "semesterName",
    },
    {
      title: "Đang diễn ra",
      dataIndex: "isActive",
      key: "isActive",
      render: (text) => {
        return (
          <Switch disabled checked={text}>
            {" "}
          </Switch>
        );
      },
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
            onConfirm={() => this.handleDeleteSemester(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon="delete">
              Xóa
            </Button>
          </Popconfirm>
          <Divider type="vertical" />
          <Button
            type="primary"
            icon="file"
            onClick={this.createRedirect(record.semesterId)}
          >
            Điều chỉnh ca thi
          </Button>
        </span>
      ),
    },
  ];

  createRedirect = (semesterId) => () => {
    console.log(this.props);
    this.props.history.push(`/admin/semester/${semesterId}`);
  };

  handleDeleteSemester = async (semester) => {
    const { semesterId } = semester;
    const res = await deleteSemester(semesterId);
    if (res.success) {
      message.success("Xóa thành công");
      await this.fetchSemester();
    } else {
      message.error(res.message);
    }
  };

  handleOpenCreateModal = () => {
    this.setState({ isCreateModalVisible: true });
  };

  handleOpenEditModal = (selectedSemester) => {
    this.setState({
      isEditModalVisible: true,
      selectedSemester,
    });
  };

  handleCreateSemester = () => {
    this.props.form.validateFields(
      ["createdSemesterName", "createdSemesterIsActive"],
      async (errors, values) => {
        if (!errors) {
          console.log(values);
          const res = await createSemester(
            values.createdSemesterName,
            values.createdSemesterIsActive
          );
          if (res.success) {
            message.success("Thêm thành công");
            this.handleCloseCreateModal();
            await this.fetchSemester();
          } else {
            message.error(res.message);
          }
        }
      }
    );
  };

  handleEditSemester = () => {
    this.props.form.validateFields(
      ["updatedSemesterName", "updatedSemesterIsActive"],
      async (errors, values) => {
        if (!errors) {
          const { semesterId } = this.state.selectedSemester;
          const res = await updateSemester(
            semesterId,
            values.updatedSemesterName,
            values.updatedSemesterIsActive
          );
          if (res.success) {
            message.success("Sửa thành công");
            this.handleCloseEditModal();
            await this.fetchSemester();
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
      selectedSemester: {},
    });
  };

  componentDidMount = async () => {
    await this.fetchSemester();
  };

  render() {
    console.log("semester", this.state.semesterList);
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
      semesterList,
      isCreateModalVisible,
      isEditModalVisible,
      selectedSemester,
    } = this.state;
    return (
      <div>
        <Row style={{ display: "flex", justifyContent: "flex-end" }}>
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
            dataSource={semesterList}
            columns={this.columns}
            rowKey={(record) => record.semesterId}
          />
        </Row>
        <Modal
          title="Thêm kỳ thi "
          visible={isCreateModalVisible}
          onOk={this.handleCreateSemester}
          onCancel={this.handleCloseCreateModal}
        >
          <Form {...formItemLayout}>
            <Form.Item label="Tên kỳ thi" hasFeedback>
              {getFieldDecorator("createdSemesterName", {
                rules: [
                  {
                    required: true,
                    message: "Hãy nhập tên kỳ thi",
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Đang diễn ra" hasFeedback>
              {getFieldDecorator("createdSemesterIsActive", {
                initialValue: true,
              })(<Switch defaultChecked />)}
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Sửa"
          visible={isEditModalVisible}
          onOk={this.handleEditSemester}
          onCancel={this.handleCloseEditModal}
        >
          <Form {...formItemLayout}>
            <Form.Item label="Tên kỳ thi" hasFeedback>
              {getFieldDecorator("updatedSemesterName", {
                initialValue: selectedSemester && selectedSemester.semesterName,
                rules: [
                  {
                    required: true,
                    message: "Hãy nhập tên kỳ thi ",
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Đang diễn ra" hasFeedback>
              {getFieldDecorator(
                "updatedSemesterIsActive",
                {}
              )(
                <Switch
                  defaultChecked={selectedSemester && selectedSemester.isActive}
                />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default withRouter(
  withLayout("admin5")(Form.create({ name: "semester" })(SemesterManager))
);
// export default Form.create({name: 'semester'})(withLayout('admin5')(SemesterManager))
