import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Row, Col } from "antd";
import {
    VideoCameraOutlined,
    PlusCircleOutlined,
    SafetyOutlined,
    TeamOutlined,
    GlobalOutlined,
    ThunderboltOutlined,
    CalendarOutlined,
    LockOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import JoinMeetingModal from "../components/JoinMeetingModal";

const Home: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [joinModalOpen, setJoinModalOpen] = useState(false);

    const features = [
        {
            icon: <SafetyOutlined className="text-3xl text-blue-500" />,
            title: "End-to-End Encryption",
            description: "Your meetings are secured with industry-standard encryption protocols.",
        },
        {
            icon: <TeamOutlined className="text-3xl text-green-500" />,
            title: "Unlimited Participants",
            description: "Host meetings with as many participants as you need, no restrictions.",
        },
        {
            icon: <GlobalOutlined className="text-3xl text-purple-500" />,
            title: "No Downloads Required",
            description: "Join meetings directly from your browser, no software installation needed.",
        },
        {
            icon: <ThunderboltOutlined className="text-3xl text-orange-500" />,
            title: "HD Video & Audio",
            description: "Crystal clear video and audio quality for professional meetings.",
        },
        {
            icon: <CalendarOutlined className="text-3xl text-cyan-500" />,
            title: "Schedule Meetings",
            description: "Plan ahead by scheduling meetings and inviting participants in advance.",
        },
        {
            icon: <LockOutlined className="text-3xl text-red-500" />,
            title: "Meeting Controls",
            description: "Full control over your meetings with muting, screen sharing, and more.",
        },
    ];

    return (
        <div className="min-h-full">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white px-8 py-16 md:py-24">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        Secure Video Meetings for Everyone
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Connect with your team, clients, and friends with our easy-to-use,
                        secure, and feature-rich video conferencing platform.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {isAuthenticated ? (
                            <Button
                                size="large"
                                icon={<PlusCircleOutlined />}
                                onClick={() => navigate("/meetings/new")}
                                className="h-12 px-8 text-base font-medium bg-white text-blue-700 border-white hover:!bg-gray-50 hover:!border-gray-50 hover:!text-blue-700"
                            >
                                Create New Meeting
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => navigate("/register")}
                                className="h-12 px-8 text-base font-medium bg-white text-blue-600 border-white hover:bg-blue-50"
                            >
                                Get Started Free
                            </Button>
                        )}
                        <Button
                            size="large"
                            icon={<VideoCameraOutlined />}
                            onClick={() => setJoinModalOpen(true)}
                            className="h-12 px-8 text-base font-medium bg-transparent text-white border-white hover:!bg-white/10 hover:!border-white hover:!text-white"
                        >
                            Join a Meeting
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="px-8 py-12">
                <div className="max-w-5xl mx-auto">
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={8}>
                            <Card
                                className="text-center h-full cursor-pointer border border-gray-100 bg-white transition-colors hover:bg-gray-50"
                                onClick={() => setJoinModalOpen(true)}
                            >
                                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                                    <VideoCameraOutlined className="text-3xl text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Join Meeting
                                </h3>
                                <p className="text-gray-500">
                                    Enter a meeting code to join an existing meeting
                                </p>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card
                                className="text-center h-full cursor-pointer border border-gray-100 bg-white transition-colors hover:bg-gray-50"
                                onClick={() => navigate(isAuthenticated ? "/meetings/new" : "/register")}
                            >
                                <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                                    <PlusCircleOutlined className="text-3xl text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Start Meeting
                                </h3>
                                <p className="text-gray-500">
                                    Create a new meeting and invite participants
                                </p>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card
                                className="text-center h-full cursor-pointer border border-gray-100 bg-white transition-colors hover:bg-gray-50"
                                onClick={() => navigate(isAuthenticated ? "/meetings" : "/login")}
                            >
                                <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                                    <CalendarOutlined className="text-3xl text-purple-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    My Meetings
                                </h3>
                                <p className="text-gray-500">
                                    View and manage your scheduled meetings
                                </p>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Features Section */}
            <div className="px-8 py-16">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Everything You Need for Great Meetings
                        </h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            Powerful features to make your video conferences more productive and secure.
                        </p>
                    </div>
                    <Row gutter={[32, 32]}>
                        {features.map((feature, index) => (
                            <Col xs={24} sm={12} lg={8} key={index}>
                                <div className="p-6 rounded-xl bg-white border border-solid border-gray-100 hover:bg-gray-50 transition-colors h-full">
                                    <div className="mb-4">{feature.icon}</div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-500">{feature.description}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>

            {/* CTA Section */}
            {!isAuthenticated && (
                <div className="px-8 py-16 bg-gray-900 text-white">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-lg text-gray-300 mb-8">
                            Join thousands of users who trust our platform for their video conferencing needs.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => navigate("/register")}
                                className="h-12 px-8"
                            >
                                Create Free Account
                            </Button>
                            <Button
                                size="large"
                                onClick={() => navigate("/login")}
                                className="h-12 px-8 bg-transparent text-white border-white hover:bg-white/10"
                            >
                                Sign In
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <JoinMeetingModal
                open={joinModalOpen}
                onClose={() => setJoinModalOpen(false)}
            />
        </div>
    );
};

export default Home;
