import { Button, Flex, Form, List, Typography } from "antd";
import { options, set } from "./const";

const PopularSet = () => {
  const form = Form.useFormInstance<CreateWorkoutPlanForm>();

  const handleOnclick = (key: keyof typeof set) => {
    form.setFieldValue(
      "items",
      set[key].map((name) => ({ name, time: 3 }))
    );
  };

  return (
    <Flex vertical>
      <Typography.Title level={4}>熱門組合</Typography.Title>
      <List
        itemLayout="horizontal"
        dataSource={options}
        renderItem={(item, index) => (
          <List.Item>
            <Flex gap={8} align="center">
              <Button type="text" onClick={() => handleOnclick(item.key)}>
                {item.title}
              </Button>
              <span style={{ color: "gray" }}>{item.description}</span>
            </Flex>
          </List.Item>
        )}
      />
    </Flex>
  );
};

export default PopularSet;
