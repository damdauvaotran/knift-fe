import { Popover, Button, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { createInvitation } from "../../api/invitation";

import { add } from "date-fns";
import { useLocation } from "react-router-dom";

const { Paragraph } = Typography;

interface ICreateInvitationProp {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  classId: number;
}

const CreateInvitation = (props: ICreateInvitationProp) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [invitation, setInvitation] = useState<string>("");

  useEffect(() => {
    createInvitation({
      classId: props.classId,
      expire: add(new Date(), { days: 1 }).valueOf(),
    }).then((res: any) => {
      console.log(res.data.invitationUrl);
      console.log(location);
      setInvitation(res.data.invitationUrl);
    });
  }, []);

  const generateInvitation = () => {
    return (
      <div style={{ width: 300 }}>
        <Paragraph copyable ellipsis>
          {window.location.host + "/invitation/" + invitation}
        </Paragraph>
      </div>
    );
  };

  return (
    <Popover
      content={generateInvitation()}
      trigger="click"
      visible={props.visible}
      onVisibleChange={props.setVisible}
    >
      <Button type="primary" icon={<MailOutlined />}>
        {t("createInvitation")}
      </Button>
    </Popover>
  );
};
export default CreateInvitation;
