import React, { useState } from "react";
import { Modal, Input, Button, Form, message } from "antd";
import { VideoCameraOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface JoinMeetingModalProps {
    open: boolean;
    onClose: () => void;
}

const JoinMeetingModal: React.FC<JoinMeetingModalProps> = ({ open, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const handleJoin = async (values: { roomCode: string; displayName?: string }) => {
        const { roomCode, displayName } = values;

        if (!roomCode.trim()) {
            message.error("Please enter a meeting code");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            const name = isAuthenticated ? user?.name : displayName || "Guest";
            navigate(`/meet/${roomCode.trim()}`, {
                state: { displayName: name },
            });
            setLoading(false);
            onClose();
            form.resetFields();
        }, 300);
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <VideoCameraOutlined className="text-white text-lg" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 m-0">
                            Join a Meeting
                        </h3>
                        <p className="text-sm text-gray-500 m-0">
                            Enter the meeting code to join
                        </p>
                    </div>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={480}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleJoin}
                className="mt-6"
                initialValues={{
                    displayName: user?.name || "",
                }}
            >
                <Form.Item
                    name="roomCode"
                    label="Meeting Code"
                    rules={[
                        { required: true, message: "Please enter the meeting code" },
                        {
                            pattern: /^[a-zA-Z0-9-]+$/,
                            message: "Meeting code can only contain letters, numbers, and hyphens",
                        },
                    ]}
                >
                    <Input
                        size="large"
                        placeholder="e.g., jitsi-abc123"
                        prefix={<VideoCameraOutlined className="text-gray-400" />}
                    />
                </Form.Item>

                {!isAuthenticated && (
                    <Form.Item
                        name="displayName"
                        label="Your Name"
                        rules={[
                            { required: true, message: "Please enter your name" },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="Enter your display name"
                            prefix={<UserOutlined className="text-gray-400" />}
                        />
                    </Form.Item>
                )}

                <div className="flex gap-3 mt-6">
                    <Button size="large" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        htmlType="submit"
                        loading={loading}
                        icon={<VideoCameraOutlined />}
                        className="flex-1"
                    >
                        Join Meeting
                    </Button>
                </div>
            </Form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 m-0">
                    <strong>Tip:</strong> Ask the meeting organizer for the meeting code.
                    It's usually something like "jitsi-abc123".
                </p>
            </div>
        </Modal>
    );
};

export default JoinMeetingModal;
