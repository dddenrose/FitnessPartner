"use client";
import { Divider, Flex, Form } from "antd";
import WorkoutSelect from "./components/WorkoutSelect";
import SubmitButton from "./components/SubmitButton";
import PopularSet from "../PopularSet";

const FormContent = () => {
  return (
    <Flex vertical style={{ width: "100%" }}>
      <PopularSet />
      <Divider />
      <WorkoutSelect />
      <Divider />
      <SubmitButton />
    </Flex>
  );
};

export default FormContent;
