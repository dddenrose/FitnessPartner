import { Form, Row, Col, Button, Typography, Flex } from "antd";
import React from "react";
import { workoutItems } from "../../const";
import { DeleteOutlined, RedoOutlined } from "@ant-design/icons";
import { CreateWorkoutPlanForm } from "@/app/interface/CreateWorkoutPlan";

const WorkoutSelect = () => {
  const form = Form.useFormInstance<CreateWorkoutPlanForm>();

  const handleToggleWorkout = (workout: string) => {
    const currentItems = form.getFieldValue("items") || [];

    // 檢查是否已選
    const index = currentItems.findIndex((item: any) => item.name === workout);

    if (index >= 0) {
      // 已選，則移除
      const newItems = currentItems.filter(
        (item: any, i: number) => i !== index
      );
      form.setFieldValue(
        "items",
        newItems.length > 0 ? newItems : [{ name: undefined, time: 3 }]
      );
    } else {
      // 未選，則添加
      const newItems = [...currentItems, { name: workout, time: 3 }];
      form.setFieldValue("items", newItems);
    }
  };

  const handleReset = () => {
    form.setFieldValue("items", [{ name: undefined, time: 3 }]);
  };

  return (
    <div>
      <Form.List name="items">
        {(fields, { add, remove }) => {
          // 獲取當前選中的運動項目
          const selectedItems = form.getFieldValue("items") || [];
          const selectedNames = selectedItems
            .map((item: any) => item.name)
            .filter((name: any) => name !== undefined);

          return (
            <>
              {/* 標題和按鈕 */}
              <Row gutter={[16, 16]} justify="space-between" className="mb-4">
                <Col span={24} sm={12}>
                  <Typography.Title
                    level={4}
                    style={{ width: "100%", margin: 0 }}
                  >
                    選擇運動項目
                  </Typography.Title>
                </Col>
                <Flex gap={8}>
                  <Button onClick={handleReset}>
                    <RedoOutlined /> 重置
                  </Button>
                </Flex>
              </Row>

              {/* 運動項目網格選擇 */}
              <Row gutter={[8, 8]}>
                {workoutItems.map((item) => {
                  const isSelected = selectedNames.includes(item);
                  return (
                    <Col key={item} xs={12} sm={8} md={6}>
                      <Button
                        block
                        onClick={() => handleToggleWorkout(item)}
                        type={isSelected ? "primary" : "default"}
                        style={{
                          height: "44px",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: isSelected ? 600 : 400,
                          opacity: isSelected ? 1 : 0.7,
                        }}
                      >
                        {item}
                      </Button>
                    </Col>
                  );
                })}
              </Row>
            </>
          );
        }}
      </Form.List>
    </div>
  );
};

export default WorkoutSelect;
