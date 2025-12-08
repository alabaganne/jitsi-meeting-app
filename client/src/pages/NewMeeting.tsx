import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Form,
    Input,
    DatePicker,
    Select,
    Card,
    message,
    Row,
    Col,
    Divider,
} from "antd";
import {
    VideoCameraOutlined,
    PlusOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    ThunderboltOutlined,
    CopyOutlined,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { useAuth } from "../context/AuthContext";

const { TextArea } = Input;

const NewMeeting: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [meetingType, setMeetingType] = useState<"instant" | "scheduled">("instant");
    const [generatedRoom, setGeneratedRoom] = useState<string>("");

    const generateRoomName = () => {
        const roomName = `jitsi-${uuidv4().slice(0, 8)}`;
        setGeneratedRoom(roomName);
        form.setFieldValue("roomName", roomName);
        return roomName;
    };

    const handleInstantMeeting = () => {
        const roomName = generateRoomName();
        navigate(`/meet/${roomName}`, {
            state: { displayName: user?.name },
        });
    };

    const handleScheduledMeeting = async (values: any) => {
        setLoading(true);

        const roomName = values.roomName || generateRoomName();

        // In a real app, this would call the API to save the meeting
        setTimeout(() => {
            message.success("Meeting scheduled successfully!");
            setLoading(false);

            // Navigate to meetings list or start the meeting
            if (values.startNow) {
                navigate(`/meet/${roomName}`, {
                    state: { displayName: user?.name },
                });
            } else {
                navigate("/meetings");
            }
        }, 500);
    };

    const copyMeetingLink = () => {
        const roomName = form.getFieldValue("roomName") || generatedRoom;
        if (roomName) {
            const link = `${window.location.origin}/meet/${roomName}`;
            navigator.clipboard.writeText(link);
            message.success("Meeting link copied to clipboard!");
        } else {
            message.warning("Please generate a room name first");
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Create New Meeting
                </h1>
                <p className="text-gray-500">
                    Start an instant meeting or schedule one for later
                </p>
            </div>

            {/* Meeting Type Selection */}
            <Row gutter={[24, 24]} className="mb-8">
                <Col xs={24} md={12}>
                    <Card
                        hoverable
                        className={`h-full cursor-pointer transition-all ${
                            meetingType === "instant"
                                ? "border-blue-500 border-2 shadow-lg"
                                : "border-gray-200"
                        }`}
                        onClick={() => setMeetingType("instant")}
                    >
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                                <ThunderboltOutlined className="text-3xl text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Instant Meeting
                            </h3>
                            <p className="text-gray-500">
                                Start a meeting right now and invite people to join
                            </p>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        hoverable
                        className={`h-full cursor-pointer transition-all ${
                            meetingType === "scheduled"
                                ? "border-blue-500 border-2 shadow-lg"
                                : "border-gray-200"
                        }`}
                        onClick={() => setMeetingType("scheduled")}
                    >
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                                <CalendarOutlined className="text-3xl text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Schedule Meeting
                            </h3>
                            <p className="text-gray-500">
                                Plan a meeting for a specific date and time
                            </p>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Instant Meeting */}
            {meetingType === "instant" && (
                <Card className="border-0 shadow-sm">
                    <div className="text-center py-8">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                            <VideoCameraOutlined className="text-4xl text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Ready to Start?
                        </h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Click the button below to start an instant meeting. You can invite
                            participants by sharing the meeting link.
                        </p>
                        <Button
                            type="primary"
                            size="large"
                            icon={<VideoCameraOutlined />}
                            onClick={handleInstantMeeting}
                            className="h-12 px-8"
                        >
                            Start Meeting Now
                        </Button>
                    </div>
                </Card>
            )}

            {/* Scheduled Meeting Form */}
            {meetingType === "scheduled" && (
                <Card className="border-0 shadow-sm">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleScheduledMeeting}
                        initialValues={{
                            duration: 60,
                        }}
                    >
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="name"
                                    label="Meeting Name"
                                    rules={[
                                        { required: true, message: "Please enter a meeting name" },
                                    ]}
                                >
                                    <Input
                                        size="large"
                                        placeholder="e.g., Team Weekly Standup"
                                        prefix={<VideoCameraOutlined className="text-gray-400" />}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="roomName"
                                    label="Meeting Code"
                                >
                                    <Input
                                        size="large"
                                        placeholder="Auto-generated"
                                        value={generatedRoom}
                                        addonAfter={
                                            <div className="flex gap-2">
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<PlusOutlined />}
                                                    onClick={generateRoomName}
                                                >
                                                    Generate
                                                </Button>
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<CopyOutlined />}
                                                    onClick={copyMeetingLink}
                                                />
                                            </div>
                                        }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="description" label="Description (Optional)">
                            <TextArea
                                rows={3}
                                placeholder="Add a description for your meeting"
                            />
                        </Form.Item>

                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="scheduledAt"
                                    label="Date & Time"
                                    rules={[
                                        { required: true, message: "Please select date and time" },
                                    ]}
                                >
                                    <DatePicker
                                        size="large"
                                        showTime
                                        format="YYYY-MM-DD HH:mm"
                                        className="w-full"
                                        disabledDate={(current) =>
                                            current && current < dayjs().startOf("day")
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="duration" label="Duration">
                                    <Select
                                        size="large"
                                        suffixIcon={<ClockCircleOutlined />}
                                    >
                                        <Select.Option value={15}>15 minutes</Select.Option>
                                        <Select.Option value={30}>30 minutes</Select.Option>
                                        <Select.Option value={45}>45 minutes</Select.Option>
                                        <Select.Option value={60}>1 hour</Select.Option>
                                        <Select.Option value={90}>1.5 hours</Select.Option>
                                        <Select.Option value={120}>2 hours</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="inviteeEmails" label="Invite Participants (Optional)">
                            <Select
                                mode="tags"
                                size="large"
                                placeholder="Enter email addresses"
                                tokenSeparators={[",", " "]}
                                suffixIcon={<TeamOutlined />}
                            />
                        </Form.Item>

                        <Divider />

                        <div className="flex flex-wrap gap-4 justify-end">
                            <Button size="large" onClick={() => navigate("/meetings")}>
                                Cancel
                            </Button>
                            <Button
                                size="large"
                                onClick={() => {
                                    form.setFieldValue("startNow", true);
                                    form.submit();
                                }}
                                loading={loading}
                            >
                                Schedule & Start Now
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                htmlType="submit"
                                loading={loading}
                                icon={<CalendarOutlined />}
                            >
                                Schedule Meeting
                            </Button>
                        </div>
                    </Form>
                </Card>
            )}
        </div>
    );
};

export default NewMeeting;
