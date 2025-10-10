import { Form, Flex } from "antd";
import React from "react";
import { initialValues } from "../PlanForm/const";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  setWorkoutPlan,
  setWorkoutType,
  setStatus,
} from "@/lib/features/exercise/exerciseSlice";
import { playAudio } from "@/lib/features/audio/audioSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux/useRedux";
import { CreateWorkoutPlanForm } from "@/app/interface/CreateWorkoutPlan";

const FormAction = ({ children }: { children: React.ReactNode }) => {
  const [form] = Form.useForm<CreateWorkoutPlanForm>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const workoutType = useAppSelector((state) => state.exercise.workoutType);

  const onFinish = () => {
    if (workoutType !== "hiit") {
      // 如果不是 HIIT 模式，不需要處理表單數據
      return;
    }

    form.validateFields().then((values) => {
      console.log("HIIT mode form values:", values);

      // 使用新的 setWorkoutPlan action 替代舊的 setTime 和 setMode
      dispatch(
        setWorkoutPlan(
          values.items.map((i) => ({
            id: `${i.name}-${Date.now()}`, // 生成唯一ID
            name: i.name,
            time: values.time,
            rest: values.rest,
          }))
        )
      );

      // 設置運動狀態為活動狀態，這樣可以自動啟動計時器
      dispatch(setStatus("active"));

      // 直接導航到運動頁面
      router.push("/exercise");
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
