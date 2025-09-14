import { Form, Flex } from "antd";
import React from "react";
import { initialValues } from "../PlanForm/const";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setMode, setTime } from "@/lib/features/exercise/exerciseSlice";
import { playAudio } from "@/lib/features/audio/audioSlice";
import { useAppDispatch } from "@/lib/hooks/index";
import { CreateWorkoutPlanForm } from "@/app/interface/CreateWorkoutPlan";

const FormAction = ({ children }: { children: React.ReactNode }) => {
  const [form] = Form.useForm<CreateWorkoutPlanForm>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onFinish = () => {
    form.validateFields().then((values) => {
      console.log(values);

      dispatch(
        setTime(
          values.items.map((i) => ({
            name: i.name,
            time: values.time,
            rest: values.rest,
          }))
        )
      );

      dispatch(setMode("exercise"));

      router.push("/exercise");

      console.log("values", values);
    });
  };

  return (
    <Form
      form={form}
      initialValues={initialValues}
      layout="vertical"
      onFinish={onFinish}
      style={{ width: "100%", maxWidth: 600 }}
    >
      {children}
    </Form>
  );
};

export default FormAction;
