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
  getAllRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  importRoom,
} from "../../../api/admin/room";

class RoomManager extends React.Component {
  state = {
    roomList: [],
    isCreateModalVisible: false,
    isEditModalVisible: false,
    createdRoom: {},
    updatedRoom: {},
    selectedRoom: {},
    file: null,
    fileList: [],
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

  columns = [
    {
      title: "Tên phòng",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "Số chỗ ngồi",
      dataIndex: "totalSlot",
      key: "totalSlot",
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
            onConfirm={() => this.handleDeleteRoom(record)}
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

  handleDeleteRoom = async (room) => {
    const { roomId } = room;
    const res = await deleteRoom(roomId);
    if (res.success) {
      message.success("Xóa thành công");
      await this.fetchRoom();
    } else {
      message.error(res.message);
    }
  };

  handleOpenCreateModal = () => {
    this.setState({ isCreateModalVisible: true });
  };

  handleOpenEditModal = (selectedRoom) => {
    this.setState({
      isEditModalVisible: true,
      selectedRoom,
    });
  };

  handleCreateRoom = () => {
    this.props.form.validateFields(
      ["createdRoomName", "createdRoomSlot"],
      async (errors, values) => {
        if (!errors) {
          const res = await createRoom(
            values.createdRoomName,
            parseInt(values.createdRoomSlot, 10)
          );
          if (res.success) {
            message.success("Thêm thành công");
            this.handleCloseCreateModal();
            await this.fetchRoom();
          } else {
            message.error(res.message);
          }
        }
      }
    );
  };

  handleEditRoom = () => {
    this.props.form.validateFields(
      ["updatedRoomName", "updatedRoomSlot"],
      async (errors, values) => {
        if (!errors) {
          const { roomId } = this.state.selectedRoom;
          const res = await updateRoom(
            roomId,
            values.updatedRoomName,
            parseInt(values.updatedRoomSlot, 10)
          );
          if (res.success) {
            message.success("Sửa thành công");
            this.handleCloseEditModal();
            await this.fetchRoom();
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
      selectedRoom: {},
    });
  };

  componentDidMount = async () => {
    await this.fetchRoom();
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
    fmData.append("rooms", file);
    try {
      const res = await importRoom(fmData);
      onSuccess("Ok");
      if (res.success) {
        message.success("Import thành công");
        await this.fetchRoom();
      } else {
        message.error(JSON.stringify(res.message));
      }
    } catch (e) {
      console.error(e);
      onError({ err: e });
    }
  };

  render() {
    console.log("room", this.state.roomList);
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
      roomList,
      isCreateModalVisible,
      isEditModalVisible,
      selectedRoom,
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
            dataSource={roomList}
            columns={this.columns}
            rowKey={(record) => record.roomId}
          />
          ;
        </Row>
        <Modal
          title="Thêm phòng"
          visible={isCreateModalVisible}
          onOk={this.handleCreateRoom}
          onCancel={this.handleCloseCreateModal}
        >
          <Form {...formItemLayout}>
            <Form.Item label="Tên phòng" hasFeedback>
              {getFieldDecorator("createdRoomName", {
                rules: [
                  {
                    required: true,
                    message: "Hãy nhập tên phòng",
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Số chỗ ngồi" hasFeedback>
              {getFieldDecorator("createdRoomSlot", {
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
        <Modal
          title="Sửa"
          visible={isEditModalVisible}
          onOk={this.handleEditRoom}
          onCancel={this.handleCloseEditModal}
        >
          <Form {...formItemLayout}>
            <Form.Item label="Tên phòng" hasFeedback>
              {getFieldDecorator("updatedRoomName", {
                initialValue: selectedRoom && selectedRoom.roomName,
                rules: [
                  {
                    required: true,
                    message: "Hãy nhập tên phòng",
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Số chỗ ngồi" hasFeedback>
              {getFieldDecorator("updatedRoomSlot", {
                initialValue: selectedRoom && selectedRoom.totalSlot,
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

export default withLayout("admin2")(
  Form.create({ name: "register" })(RoomManager)
);
