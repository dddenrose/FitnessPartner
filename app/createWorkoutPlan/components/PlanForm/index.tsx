"use client";
import React from "react";
import FormContent from "../FormContent";
import { Flex, Form } from "antd";
import { initialValues } from "./const";

const PlanForm = () => {
  const [form] = Form.useForm();

  return (
    <Form form={form} initialValues={initialValues} layout="vertical">
      <Flex
        vertical
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FormContent />
      </Flex>
    </Form>
  );
};

export default PlanForm;
