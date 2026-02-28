"use client";
import React, { useState, useEffect } from "react";
import { Form, InputNumber, Button, Progress, Space, message } from "antd";
import { SaveOutlined, EditOutlined, CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  saveUserProfile,
  selectUserProfile,
  selectUserProfileSaving,
} from "@/lib/features/userProfile/userProfileSlice";
import { selectAllWorkoutSessions } from "@/lib/features/workoutReport/workoutReportSlice";
import type { AppDispatch } from "@/lib/store";
import type { ProfileData } from "@/lib/features/userProfile/userProfileSlice";

const GoalSettings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector(selectUserProfile);
  const saving = useSelector(selectUserProfileSaving);
  const allSessions = useSelector(selectAllWorkoutSessions);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (profile?.fitnessGoals) {
      form.setFieldsValue({
        weeklyWorkoutTarget: profile.fitnessGoals.weeklyWorkoutTarget,
        weeklyDurationTarget: profile.fitnessGoals.weeklyDurationTarget,
      });
    }
  }, [profile, form]);

  const thisWeekSessions = (() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekStartStr = weekStart.toISOString().split("T")[0];
    return allSessions.filter((s) => s.date >= weekStartStr);
  })();

  const weeklyWorkoutCount = thisWeekSessions.length;
  const weeklyDurationMinutes = thisWeekSessions.reduce(
    (acc, s) => acc + s.duration,
    0,
  );

  const workoutTarget = profile?.fitnessGoals?.weeklyWorkoutTarget ?? 3;
  const durationTarget = profile?.fitnessGoals?.weeklyDurationTarget ?? 150;

  const workoutPercent = Math.min(
    Math.round((weeklyWorkoutCount / workoutTarget) * 100),
    100,
  );
  const durationPercent = Math.min(
    Math.round((weeklyDurationMinutes / durationTarget) * 100),
    100,
  );

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!profile) return;

      const updated: ProfileData = {
        ...profile,
        fitnessGoals: {
          weeklyWorkoutTarget: values.weeklyWorkoutTarget,
          weeklyDurationTarget: values.weeklyDurationTarget,
        },
      };

      await dispatch(saveUserProfile(updated)).unwrap();
      message.success("健身目標已更新");
      setEditing(false);
    } catch {
      message.error("儲存失敗，請重試");
    }
  };

  const handleCancel = () => {
    if (profile?.fitnessGoals) {
      form.setFieldsValue({
        weeklyWorkoutTarget: profile.fitnessGoals.weeklyWorkoutTarget,
        weeklyDurationTarget: profile.fitnessGoals.weeklyDurationTarget,
      });
    }
    setEditing(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold m-0">健身目標</h2>
        {!editing && (
          <Button
            icon={<EditOutlined />}
            onClick={() => setEditing(true)}
            type="text"
          >
            編輯
          </Button>
        )}
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between mb-1">
            <span>本週訓練次數</span>
            <span>
              {weeklyWorkoutCount} / {workoutTarget} 次
            </span>
          </div>
          <Progress
            percent={workoutPercent}
            status={workoutPercent >= 100 ? "success" : "active"}
          />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span>本週訓練時長</span>
            <span>
              {weeklyDurationMinutes} / {durationTarget} 分鐘
            </span>
          </div>
          <Progress
            percent={durationPercent}
            status={durationPercent >= 100 ? "success" : "active"}
            strokeColor="#52c41a"
          />
        </div>
      </div>

      <Form form={form} layout="vertical" disabled={!editing}>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="每週訓練目標（次）"
            name="weeklyWorkoutTarget"
            rules={[{ required: true, message: "請設定目標" }]}
          >
            <InputNumber className="w-full" min={1} max={14} />
          </Form.Item>
          <Form.Item
            label="每週訓練時長目標（分鐘）"
            name="weeklyDurationTarget"
            rules={[{ required: true, message: "請設定目標" }]}
          >
            <InputNumber className="w-full" min={10} max={1000} />
          </Form.Item>
        </div>
        {editing && (
          <Form.Item>
            <Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                loading={saving}
              >
                儲存
              </Button>
              <Button icon={<CloseOutlined />} onClick={handleCancel}>
                取消
              </Button>
            </Space>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default GoalSettings;
