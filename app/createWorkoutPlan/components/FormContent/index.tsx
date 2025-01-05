"use client";
import { Flex, Form } from "antd";
import WorkoutSelect from "./components/WorkoutSelect";
import SubmitButton from "./components/SubmitButton";

const FormContent = () => {
  return (
    <Flex vertical style={{ width: "100%", maxWidth: 600 }}>
      <WorkoutSelect />
      <SubmitButton />
    </Flex>
  );
};

export default FormContent;
