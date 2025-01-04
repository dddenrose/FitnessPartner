"use client";
import { Button, Form, Input, Select } from "antd";
import React from "react";

const FormContent = () => {
  return (
    <Form.List name="items">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name }) => (
            <>
              <Form.Item name={[key, "name"]} key={key} label="運動">
                <Select placeholder="請選擇運動項目" />
              </Form.Item>

              <Button onClick={() => remove(name)}>Remove</Button>
            </>
          ))}

          <Button onClick={add}>Add</Button>
        </>
      )}
    </Form.List>
  );
};

export default FormContent;
