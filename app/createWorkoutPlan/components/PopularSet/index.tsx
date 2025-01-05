import { Button, Flex, List, Typography } from "antd";

const PopularSet = () => {
  const data = [
    {
      title: "初階燃脂組合",
      description: "燃脂組合，適合初學者",
    },
    {
      title: "下肢肌群訓練",
      description: "訓練臀腿，適合中階有基礎體能者",
    },
  ];

  return (
    <Flex vertical>
      <Typography.Title level={4}>熱門組合</Typography.Title>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <Flex gap={8} align="center">
              <Button type="text">{item.title}</Button>
              <span style={{ color: "gray" }}>{item.description}</span>
            </Flex>
          </List.Item>
        )}
      />
    </Flex>
  );
};

export default PopularSet;
