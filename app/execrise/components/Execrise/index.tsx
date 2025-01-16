import { RootState } from "@/lib/store";
import { Flex, Typography } from "antd";
import React from "react";
import { useSelector } from "react-redux";

const Execrise: React.FC = () => {
  const time = useSelector((state: RootState) => state.execrise.time);

  const getText = () => {
    if (time?.length === 0) {
      return "Finish!";
    }

    if (time?.[0]?.time > 0) {
      return `00:${time[0].time < 10 ? `0${time[0].time}` : time[0].time}`;
    }

    return "00:00";
  };

  return (
    <Flex vertical align="center">
      <Typography.Title level={2} style={{ color: "white" }}>
        {time?.[0]?.name}
      </Typography.Title>
      <div className="text-9xl text-white">{getText()}</div>
    </Flex>
  );
};

export default Execrise;
