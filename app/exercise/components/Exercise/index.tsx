import { RootState } from "@/lib/store";
import { Flex, Typography } from "antd";
import React from "react";
import { useSelector } from "react-redux";

const Exercise: React.FC = () => {
  const time = useSelector((state: RootState) => state.exercise.times);

  const getText = () => {
    if (time?.[0]?.time > 0) {
      return `00:${time[0].time < 10 ? `0${time[0].time}` : time[0].time}`;
    }

    if (time?.[0]?.rest > 0) {
      return `00:${time[0].rest < 10 ? `0${time[0].rest}` : time[0].rest}`;
    }

    return "00:00";
  };

  return (
    <Flex vertical align="center">
      <Typography.Title level={2} style={{ color: "white" }}>
        {time?.[0]?.time > 0 ? time?.[0]?.name : "休息"}
      </Typography.Title>
      <div className="text-9xl text-white">{getText()}</div>
    </Flex>
  );
};

export default Exercise;
