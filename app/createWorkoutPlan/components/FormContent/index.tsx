"use client";
import { Flex, Form } from "antd";
import WorkoutSelect from "./components/WorkoutSelect";

const FormContent = () => {
  const form = Form.useFormInstance();

  const value = Form.useWatch([], form);

  console.log(value, "===values");
  return (
    <Flex vertical style={{ width: "100%", maxWidth: 600 }}>
      <WorkoutSelect />
    </Flex>
  );
};

export default FormContent;
