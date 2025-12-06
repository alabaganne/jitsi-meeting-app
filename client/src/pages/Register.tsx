import React, { useState } from "react";
import { Button, Form, Input, Divider } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RegisterPayload } from "../types";

const Register: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const onFinish = async (values: RegisterPayload) => {
        setLoading(true);
        const success = await register(values);
        setLoading(false);

        if (success) {
            navigate("/", { replace: true });
        }
    };

    return (
        <div className="min-h-full flex">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                            <VideoCameraOutlined className="text-white text-2xl" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Create Your Account
                        </h1>
                        <p className="text-gray-500">
                            Get started with free video conferencing
                        </p>
                    </div>

                    <Form
                        name="register"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                        requiredMark={false}
                    >
                        <Form.Item
                            name="name"
                            label="Full Name"
                            rules={[
                                { required: true, message: "Please enter your name" },
                                { min: 2, message: "Name must be at least 2 characters" },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="text-gray-400" />}
                                placeholder="Enter your full name"
                            />
                        </Form.Item>

                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[
                                { required: true, message: "Please enter a username" },
                                { min: 3, message: "Username must be at least 3 characters" },
                                {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message: "Username can only contain letters, numbers, and underscores",
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="text-gray-400" />}
                                placeholder="Choose a username"
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email Address"
                            rules={[
                                { required: true, message: "Please enter your email" },
                                { type: "email", message: "Please enter a valid email" },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined className="text-gray-400" />}
                                placeholder="Enter your email address"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                { required: true, message: "Please enter a password" },
                                { min: 6, message: "Password must be at least 6 characters" },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Create a password"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Confirm Password"
                            dependencies={["password"]}
                            rules={[
                                { required: true, message: "Please confirm your password" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Passwords do not match"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Confirm your password"
                            />
                        </Form.Item>

                        <Form.Item className="mb-4">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                className="h-12"
                            >
                                Create Account
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider className="text-gray-400">or</Divider>

                    <p className="text-center text-gray-500">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Branding */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 items-center justify-center p-16">
                <div className="text-center text-white max-w-lg">
                    <h2 className="text-4xl font-bold mb-6">
                        Join Jitsi Meet Today
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Start hosting secure video meetings in minutes. No credit card required.
                    </p>
                    <div className="space-y-4 text-left">
                        <div className="flex items-center gap-4 bg-white/10 rounded-lg p-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl">
                                1
                            </div>
                            <div>
                                <h4 className="font-semibold">Create your account</h4>
                                <p className="text-blue-100 text-sm">Sign up with your email in seconds</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/10 rounded-lg p-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl">
                                2
                            </div>
                            <div>
                                <h4 className="font-semibold">Create or join meetings</h4>
                                <p className="text-blue-100 text-sm">Start a new meeting or join with a code</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/10 rounded-lg p-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl">
                                3
                            </div>
                            <div>
                                <h4 className="font-semibold">Collaborate securely</h4>
                                <p className="text-blue-100 text-sm">Enjoy encrypted, high-quality video calls</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
