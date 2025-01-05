import { Form, Flex } from "antd";
import React from "react";
import { initialValues } from "../PlanForm/const";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setTime } from "@/lib/features/execrise/execriseSlice";

const FormAction = ({ children }: { children: React.ReactNode }) => {
  const [form] = Form.useForm<CreateWorkoutPlanForm>();
  const router = useRouter();
  const dispatch = useDispatch();

  const onFinish = () => {
    form.validateFields().then((values) => {
      console.log(values);

      dispatch(
        setTime(
          values.items.map((i) => ({
            name: i.name,
            time: 3,
          }))
        )
      );

      router.push("/execrise");
    });
  };

  return (
    <Form
      form={form}
      initialValues={initialValues}
      layout="vertical"
      onFinish={onFinish}
    >
      <Flex
        vertical
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </Flex>
    </Form>
  );
};

export default FormAction;
