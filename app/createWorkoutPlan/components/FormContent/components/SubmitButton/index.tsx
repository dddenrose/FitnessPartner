import { Button, Flex } from "antd";
import React from "react";

const SubmitButton = () => {
  return (
    <Flex justify="end">
      <Button type="primary" htmlType="submit" style={{ width: 100 }}>
        完成
      </Button>
    </Flex>
  );
};

export default SubmitButton;
