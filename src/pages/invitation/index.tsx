import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Modal, Form, Typography } from "antd";
import { getInvitationInfo } from "../../api/invitation";
import { withLayout } from "../../shared-component/Layout/Layout";
import { useTranslation } from "react-i18next";

const { Item } = Form;
const { Text } = Typography;

const Invitation = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [className, setClassName] = useState<string>("");
  const [teacherName, setTeacherName] = useState<string>("");

  // @ts-ignore
  const { invitation } = useParams();
  const { t } = useTranslation();
  useEffect(() => {
    getInvitationInfo(invitation).then((res: any) => {
      console.log(res);
      setVisible(true);
    });
  }, []);

  const handleAccept = () => {};
  return (
    <div>
      <Modal visible={visible} onOk={handleAccept}>
        <Text>
          {t("joinClassText", {
            className: className,
            teacherName: teacherName,
          })}
        </Text>
      </Modal>
    </div>
  );
};

export default withLayout("1")(Invitation);
