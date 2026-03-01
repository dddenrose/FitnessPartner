"use client";
import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Button, Space, message } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  saveUserProfile,
  selectUserProfile,
  selectUserProfileSaving,
} from "@/lib/features/userProfile/userProfileSlice";
import type { AppDispatch } from "@/lib/store";
import type { ProfileData } from "@/lib/features/userProfile/userProfileSlice";

const BasicInfoForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector(selectUserProfile);
  const saving = useSelector(selectUserProfileSaving);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        displayName: profile.displayName,
        age: profile.age || undefined,
        height: profile.height || undefined,
        weight: profile.weight || undefined,
      });
    }
  }, [profile, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!profile) return;

      const updated: ProfileData = {
        ...profile,
        displayName: values.displayName,
        age: values.age ?? 0,
        height: values.height ?? 0,
        weight: values.weight ?? 0,
      };

      await dispatch(saveUserProfile(updated)).unwrap();
      message.success("個人資料已儲存");
      setEditing(false);
    } catch {
      message.error("儲存失敗，請重試");
    }
  };

  const handleCancel = () => {
    if (profile) {
      form.setFieldsValue({
        displayName: profile.displayName,
        age: profile.age || undefined,
        height: profile.height || undefined,
        weight: profile.weight || undefined,
      });
    }
    setEditing(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold m-0">基本資料</h2>
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
      <Form form={form} layout="vertical" disabled={!editing}>
        <Form.Item
          label="顯示名稱"
          name="displayName"
          rules={[{ required: true, message: "請輸入顯示名稱" }]}
        >
          <Input placeholder="輸入您的名稱" />
        </Form.Item>
        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            label="年齡"
            name="age"
            rules={[
              { type: "number", min: 1, max: 120, message: "請輸入有效年齡" },
            ]}
          >
            <InputNumber
              className="w-full"
              placeholder="歲"
              min={1}
              max={120}
            />
          </Form.Item>
          <Form.Item
            label="身高"
            name="height"
            rules={[
              { type: "number", min: 50, max: 300, message: "請輸入有效身高" },
            ]}
          >
            <InputNumber
              className="w-full"
              placeholder="cm"
              min={50}
              max={300}
              addonAfter="cm"
            />
          </Form.Item>
          <Form.Item
            label="體重"
            name="weight"
            rules={[
              { type: "number", min: 1, max: 500, message: "請輸入有效體重" },
            ]}
          >
            <InputNumber
              className="w-full"
              placeholder="kg"
              min={1}
              max={500}
              addonAfter="kg"
            />
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

export default BasicInfoForm;
