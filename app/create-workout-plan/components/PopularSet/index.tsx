import { Button, Card, Flex, Form, Row, Col, Typography, Space } from "antd";
import { options, set } from "./const";
import { CreateWorkoutPlanForm } from "@/app/interface/CreateWorkoutPlan";

const PopularSet = () => {
  const form = Form.useFormInstance<CreateWorkoutPlanForm>();

  const handleOnclick = (key: keyof typeof set) => {
    form.setFieldValue(
      "items",
      set[key].map((name) => ({ name, time: 3 }))
    );
  };

  return (
    <Flex vertical gap={16}>
      <div>
        <Typography.Title level={4} style={{ margin: 0 }}>
          熱門訓練組合
        </Typography.Title>
        <Typography.Text type="secondary">
          快速選擇預設的運動組合
        </Typography.Text>
      </div>

      <Row gutter={[16, 16]}>
        {options.map((item) => (
          <Col key={item.key} xs={24} sm={12} md={8}>
            <Card
              hoverable
              onClick={() => handleOnclick(item.key)}
              style={{
                cursor: "pointer",
                height: "100%",
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-primary)",
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <Space direction="vertical" style={{ width: "100%" }} size={8}>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  {item.title}
                </Typography.Title>
                <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
                  {item.description}
                </Typography.Text>
                <Button type="primary" block size="small">
                  選擇此組合
                </Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Flex>
  );
};

export default PopularSet;
