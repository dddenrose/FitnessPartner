import { Col, Flex, Form, InputNumber, Row, Select, Typography } from "antd";
import React from "react";

const TimeSelect: React.FC = () => {
  return (
    <Flex vertical>
      <Typography.Title level={4}>時間設定</Typography.Title>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="每組時間"
            name="time"
            style={{ width: "100%" }}
            rules={[{ required: true, message: "請輸入每組時間" }]}
          >
            <Select
              options={[10, 20, 30, 40, 50, 60, 70, 80, 90].map((t) => ({
                label: `${t} 秒`,
                value: t,
              }))}
              placeholder="每組時間"
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="組間休息時間"
            name="rest"
            style={{ width: "100%" }}
            rules={[{ required: true, message: "請輸入組間休息時間" }]}
          >
            <Select
              options={[0, 10, 20, 30, 40, 50, 60].map((t) => ({
                label: `${t} 秒`,
                value: t,
              }))}
              placeholder="組間休息時間"
            />
          </Form.Item>
        </Col>
      </Row>
    </Flex>
  );
};

export default TimeSelect;
