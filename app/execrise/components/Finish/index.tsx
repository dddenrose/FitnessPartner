"use clients";
import { SmileFilled } from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

const Finish: React.FC = () => {
  const router = useRouter();

  return (
    <Flex vertical align="center" gap={16}>
      <SmileFilled style={{ color: "white", fontSize: 64 }} />
      <Typography.Title
        level={1}
        style={{ color: "white", textAlign: "center" }}
      >
        Well done! <br />
        You have finished today&apos;s execrise!
      </Typography.Title>
      <Button type="primary" onClick={() => router.push("/")}>
        Finish!
      </Button>
    </Flex>
  );
};

export default Finish;
