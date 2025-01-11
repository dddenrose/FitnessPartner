import { Form, Row, Col, Select, Button, Typography, Flex } from "antd";
import React from "react";
import { workoutItems } from "../../const";
import { DeleteOutlined, PlusOutlined, RedoOutlined } from "@ant-design/icons";

const WorkoutSelect = () => {
  return (
    <Form.List name="items">
      {(fields, { add, remove }) => (
        <>
          <Flex justify="between" gap={8}>
            <Typography.Title level={4} style={{ width: "100%" }}>
              自訂運動項目
            </Typography.Title>
            <Button>
              <RedoOutlined /> 重置
            </Button>
            <Button type="primary" onClick={() => add()}>
              <PlusOutlined /> 新增項目
            </Button>
          </Flex>

          <Row gutter={[16, 16]} align="top" style={{ marginBottom: 16 }}>
            {fields.map(({ key, name }) => (
              <Col span={12} key={key}>
                <Flex gap={8} align="end">
                  <Form.Item
                    name={[name, "name"]}
                    label={`運動 ${name + 1}`}
                    style={{ margin: 0, flex: 1 }}
                    rules={[
                      { required: name === 0, message: "請選擇運動項目" },
                    ]}
                  >
                    <Select
                      placeholder="請選擇運動項目"
                      options={workoutItems.map((d) => ({
                        label: d,
                        value: d,
                      }))}
                    />
                  </Form.Item>

                  <Button
                    onClick={() => remove(name)}
                    disabled={fields.length === 1}
                    icon={<DeleteOutlined />}
                  />
                </Flex>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Form.List>
  );
};

export default WorkoutSelect;
