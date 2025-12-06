import React, { useState } from "react";
import { Button, Form, Input, Divider } from "antd";
import { UserOutlined, LockOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoginPayload } from "../types";

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

    const onFinish = async (values: LoginPayload) => {
        setLoading(true);
        const success = await login(values);
        setLoading(false);

        if (success) {
            navigate(from, { replace: true });
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
                            Welcome Back
                        </h1>
                        <p className="text-gray-500">
                            Sign in to continue to Jitsi Meet
                        </p>
                    </div>

                    <Form
                        name="login"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                        requiredMark={false}
                    >
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[
                                { required: true, message: "Please enter your username" },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="text-gray-400" />}
                                placeholder="Enter your username"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                { required: true, message: "Please enter your password" },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Enter your password"
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
                                Sign In
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider className="text-gray-400">or</Divider>

                    <p className="text-center text-gray-500">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-600 font-medium hover:text-blue-700">
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Branding */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 items-center justify-center p-16">
                <div className="text-center text-white max-w-lg">
                    <h2 className="text-4xl font-bold mb-6">
                        Secure Video Meetings
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Connect with your team from anywhere in the world with our secure,
                        easy-to-use video conferencing platform.
                    </p>
                    <div className="grid grid-cols-2 gap-6 text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                <VideoCameraOutlined className="text-white" />
                            </div>
                            <span>HD Video Quality</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                <LockOutlined className="text-white" />
                            </div>
                            <span>End-to-End Encrypted</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                <UserOutlined className="text-white" />
                            </div>
                            <span>Unlimited Participants</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                <VideoCameraOutlined className="text-white" />
                            </div>
                            <span>Screen Sharing</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
