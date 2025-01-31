"use client";
import { Divider, Flex, Form } from "antd";
import WorkoutSelect from "./components/WorkoutSelect";
import SubmitButton from "./components/SubmitButton";
import PopularSet from "../PopularSet";
import RestItem from "./components/TimeSelect";

const FormContent = () => {
  return (
    <Flex vertical style={{ width: "100%" }}>
      <PopularSet />
      <Divider />
      <WorkoutSelect />
      <Divider />
      <RestItem />
      <Divider />
      <SubmitButton />
    </Flex>
  );
};

export default FormContent;
