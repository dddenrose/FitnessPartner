"use client";
import React from "react";
import FormContent from "../FormContent";
import { Flex, Form } from "antd";
import { initialValues } from "./const";

const PlanForm = () => {
  const [form] = Form.useForm();

  return (
    <Flex>
      <Form form={form} initialValues={initialValues}>
        <FormContent />
      </Form>
    </Flex>
  );
};

export default PlanForm;
