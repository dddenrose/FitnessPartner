import { Form, Row, Col, Select, Button, Typography, Flex } from "antd";
import React from "react";
import { workoutItems } from "../../const";
import { DeleteOutlined, PlusOutlined, RedoOutlined } from "@ant-design/icons";
import RestItem from "../TimeSelect";
import { CreateWorkoutPlanForm } from "@/app/interface/CreateWorkoutPlan";

const WorkoutSelect = () => {
  const form = Form.useFormInstance<CreateWorkoutPlanForm>();
  return (
    <div>
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            <Row gutter={[16, 16]} justify="space-between" className="mb-4">
              <Col span={24} sm={12}>
                <Typography.Title
                  level={4}
                  style={{ width: "100%", margin: 0 }}
                >
                  自訂運動項目
                </Typography.Title>
              </Col>
              <Flex gap={8}>
                <Button
                  onClick={() =>
                    form.setFieldValue("items", [{ name: undefined }])
                  }
                >
                  <RedoOutlined /> 重置
                </Button>
                <Button type="primary" onClick={() => add()}>
                  <PlusOutlined /> 新增項目
                </Button>
              </Flex>
            </Row>

            <Row gutter={[16, 16]} align="top" style={{ marginBottom: 16 }}>
              {fields.map(({ key, name }) => (
                <Col span={24} sm={12} key={key}>
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
    </div>
  );
};

export default WorkoutSelect;
