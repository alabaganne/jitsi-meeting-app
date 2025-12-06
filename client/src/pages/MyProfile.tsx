import { useState } from "react";
import {
    Button,
    Form,
    Input,
    Card,
    Avatar,
    message,
    Row,
    Col,
    Tabs,
} from "antd";
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    SaveOutlined,
    CameraOutlined,
    BellOutlined,
    SettingOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";

const MyProfile: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");

    const handleProfileUpdate = async (values: any) => {
        setProfileLoading(true);
        // Simulate API call
        setTimeout(() => {
            updateUser({
                name: values.name,
                email: values.email,
            });
            message.success("Profile updated successfully!");
            setProfileLoading(false);
        }, 500);
    };

    const handlePasswordChange = async (_values: unknown) => {
        setPasswordLoading(true);
        // Simulate API call
        setTimeout(() => {
            message.success("Password changed successfully!");
            passwordForm.resetFields();
            setPasswordLoading(false);
        }, 500);
    };

    const tabItems = [
        {
            key: "profile",
            label: (
                <span className="flex items-center gap-2">
                    <UserOutlined />
                    Profile
                </span>
            ),
            children: (
                <div className="py-4">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="relative">
                            <Avatar
                                size={100}
                                style={{
                                    backgroundColor: "#1677ff",
                                    fontSize: "2.5rem",
                                }}
                            >
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                            </Avatar>
                            <Button
                                type="primary"
                                shape="circle"
                                size="small"
                                icon={<CameraOutlined />}
                                className="absolute bottom-0 right-0"
                                onClick={() => message.info("Photo upload coming soon")}
                            />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                                {user?.name || "User"}
                            </h3>
                            <p className="text-gray-500">@{user?.username || "username"}</p>
                        </div>
                    </div>

                    <Form
                        form={profileForm}
                        layout="vertical"
                        onFinish={handleProfileUpdate}
                        initialValues={{
                            name: user?.name || "",
                            email: user?.email || "",
                            username: user?.username || "",
                        }}
                    >
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="name"
                                    label="Full Name"
                                    rules={[
                                        { required: true, message: "Please enter your name" },
                                    ]}
                                >
                                    <Input
                                        size="large"
                                        prefix={<UserOutlined className="text-gray-400" />}
                                        placeholder="Enter your full name"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="username"
                                    label="Username"
                                >
                                    <Input
                                        size="large"
                                        prefix={<UserOutlined className="text-gray-400" />}
                                        placeholder="Username"
                                        disabled
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="email"
                            label="Email Address"
                            rules={[
                                { required: true, message: "Please enter your email" },
                                { type: "email", message: "Please enter a valid email" },
                            ]}
                        >
                            <Input
                                size="large"
                                prefix={<MailOutlined className="text-gray-400" />}
                                placeholder="Enter your email address"
                            />
                        </Form.Item>

                        <Button
                            type="primary"
                            size="large"
                            htmlType="submit"
                            loading={profileLoading}
                            icon={<SaveOutlined />}
                        >
                            Save Changes
                        </Button>
                    </Form>
                </div>
            ),
        },
        {
            key: "security",
            label: (
                <span className="flex items-center gap-2">
                    <LockOutlined />
                    Security
                </span>
            ),
            children: (
                <div className="py-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Change Password
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Ensure your account is using a strong password to stay secure.
                    </p>

                    <Form
                        form={passwordForm}
                        layout="vertical"
                        onFinish={handlePasswordChange}
                        className="max-w-md"
                    >
                        <Form.Item
                            name="currentPassword"
                            label="Current Password"
                            rules={[
                                { required: true, message: "Please enter your current password" },
                            ]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Enter current password"
                            />
                        </Form.Item>

                        <Form.Item
                            name="newPassword"
                            label="New Password"
                            rules={[
                                { required: true, message: "Please enter a new password" },
                                { min: 6, message: "Password must be at least 6 characters" },
                            ]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Enter new password"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmNewPassword"
                            label="Confirm New Password"
                            dependencies={["newPassword"]}
                            rules={[
                                { required: true, message: "Please confirm your new password" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("newPassword") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Passwords do not match"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Confirm new password"
                            />
                        </Form.Item>

                        <Button
                            type="primary"
                            size="large"
                            htmlType="submit"
                            loading={passwordLoading}
                            icon={<LockOutlined />}
                        >
                            Update Password
                        </Button>
                    </Form>
                </div>
            ),
        },
        {
            key: "preferences",
            label: (
                <span className="flex items-center gap-2">
                    <SettingOutlined />
                    Preferences
                </span>
            ),
            children: (
                <div className="py-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Meeting Preferences
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Customize your default meeting settings.
                    </p>

                    <div className="space-y-4 max-w-lg">
                        <Card className="border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <VideoCameraOutlined className="text-xl text-blue-500" />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Start with video on
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Enable video when joining meetings
                                        </p>
                                    </div>
                                </div>
                                <Button type="default">Configure</Button>
                            </div>
                        </Card>

                        <Card className="border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <BellOutlined className="text-xl text-green-500" />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Meeting Notifications
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Get reminded before scheduled meetings
                                        </p>
                                    </div>
                                </div>
                                <Button type="default">Configure</Button>
                            </div>
                        </Card>

                        <Card className="border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <SettingOutlined className="text-xl text-purple-500" />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Audio Settings
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Configure microphone and speaker
                                        </p>
                                    </div>
                                </div>
                                <Button type="default">Configure</Button>
                            </div>
                        </Card>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Account Settings
                </h1>
                <p className="text-gray-500">
                    Manage your profile, security, and preferences
                </p>
            </div>

            {/* Content */}
            <Card className="border-0 shadow-sm">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    tabPosition="left"
                    className="profile-tabs"
                />
            </Card>
        </div>
    );
};

export default MyProfile;
