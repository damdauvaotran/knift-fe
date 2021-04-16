import React from "react";
import { withLayout } from "../../shared-component/Layout/Layout";
import ExamRegister from "../conference";

const Dashboard: React.FC = () => {
  return (
    <div>
      <ExamRegister />
    </div>
  );
};

export default withLayout(Dashboard);
