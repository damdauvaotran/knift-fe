import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Modal, Form, Typography, notification } from "antd";
import { getInvitationInfo, acceptInvitation } from "../../api/invitation";
import { withLayout } from "../../shared-component/Layout/Layout";
import { useTranslation } from "react-i18next";
import { getUserData } from "../../utils/auth";

import { ROLE } from "../../constant";

const { Item } = Form;
const { Text } = Typography;

const Invitation = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [className, setClassName] = useState<string>("");
  const [teacherName, setTeacherName] = useState<string>("");

  // @ts-ignore
  const { invitation } = useParams();
  const { t } = useTranslation();
  const history = useHistory();
  const { role } = getUserData();

  useEffect(() => {
    getInvitationInfo(invitation).then((res: any) => {
      if (res?.success) {
        setVisible(true);
        const { invitation } = res.data;
        console.log(invitation);
        setClassName(invitation.className);
        setTeacherName(invitation.teacherName);
      }
    });
  }, []);

  const handleAccept = async () => {
    const res = await acceptInvitation(invitation);
    if (res.success) {
      history.push("/class");
    } else {
      notification.error({ message: res.message });
      history.push("/class");
    }
  };

  const handleDecline = async () => {
    history.push("/class");
  };
  return (
    <div>
      {role === ROLE.student && (
        <Modal visible={visible} onOk={handleAccept} onCancel={handleDecline}>
          <Text>
            {t("joinClassText", {
              className: className,
              teacherName: teacherName,
            })}
          </Text>
        </Modal>
      )}
      {role === ROLE.teacher && <div>{t("teacherCannotJoin")}</div>}
    </div>
  );
};

export default Invitation;
