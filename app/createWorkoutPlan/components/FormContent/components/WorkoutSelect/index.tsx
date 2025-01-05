import { Form, Row, Col, Select, Button } from "antd";
import React from "react";
import { workoutItems } from "../../const";

const WorkoutSelect = () => {
  return (
    <Form.List name="items">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name }) => (
            <Row
              key={key}
              gutter={16}
              align="bottom"
              style={{ marginBottom: 16 }}
            >
              <Col span={18}>
                <Form.Item
                  name={[name, "name"]}
                  label="運動"
                  style={{ margin: 0 }}
                >
                  <Select
                    placeholder="請選擇運動項目"
                    options={workoutItems.map((d) => ({
                      label: d,
                      value: d,
                    }))}
                  />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Button onClick={() => remove(name)}>Remove</Button>
              </Col>
            </Row>
          ))}

          <Button
            onClick={() =>
              add({
                name: undefined,
              })
            }
            style={{ width: 160 }}
          >
            Add
          </Button>
        </>
      )}
    </Form.List>
  );
};

export default WorkoutSelect;
