"use client";
import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Tabs,
  message,
  Divider,
  Typography,
  Alert,
} from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "@/lib/hooks/index";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

interface FormValues {
  email: string;
  password: string;
  displayName?: string;
  confirmPassword?: string;
}

const EmailPasswordForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();

  const { signIn, signUp } = useAuth();

  const handleLogin = async (values: FormValues) => {
    try {
      setLoading(true);
      setError(null);

      const { email, password } = values;
      await signIn(email, password);
      message.success("Login successful!");
    } catch (error: any) {
      console.error("Login error:", error);

      // Show user-friendly error messages
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password. Please try again.");
      } else if (error.code === "auth/invalid-credential") {
        setError("Invalid credentials. Please try again.");
      } else {
        setError(`Login failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: FormValues) => {
    try {
      setLoading(true);
      setError(null);

      const { email, password, displayName = "" } = values;

      // Register the user with email, password and displayName
      await signUp(email, password, displayName);

      message.success("Registration successful!");
      setActiveTab("login");
    } catch (error: any) {
      console.error("Registration error:", error);

      // Show user-friendly error messages
      if (error.code === "auth/email-already-in-use") {
        setError(
          "This email is already registered. Please use a different email or login."
        );
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.");
      } else {
        setError(`Registration failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    form.resetFields();
    setError(null);
  };

  return (
    <div className="mt-6">
      <Divider>Or</Divider>

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        centered
        className="auth-tabs"
      >
        <TabPane tab="Login" key="login">
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-4"
              closable
              onClose={() => setError(null)}
            />
          )}
          <Form
            form={form}
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="Register" key="register">
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-4"
              closable
              onClose={() => setError(null)}
            />
          )}
          <Form
            form={form}
            name="register"
            onFinish={handleRegister}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="displayName"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Full Name"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                Register
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>

      <div className="mt-4 text-center">
        <Text type="secondary" className="text-sm">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </div>
    </div>
  );
};

export default EmailPasswordForm;
