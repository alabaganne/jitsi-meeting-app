import { useState } from "react";
import {
    HomeOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PlusCircleOutlined,
    UnlockOutlined,
    UserAddOutlined,
    UserOutlined,
    VideoCameraOutlined,
    CalendarOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, Avatar, Dropdown, Spin, ConfigProvider } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Footer from "./Footer";
import { useAuth } from "../context/AuthContext";
import JoinMeetingModal from "./JoinMeetingModal";

const { Header, Sider, Content } = Layout;

const lightTheme = {
    token: {
        colorPrimary: "#1677ff",
        colorBgContainer: "#ffffff",
        colorBgLayout: "#f5f7fa",
        borderRadius: 8,
        colorText: "#1f2937",
        colorTextSecondary: "#6b7280",
    },
    components: {
        Menu: {
            itemBg: "transparent",
            itemColor: "#4b5563",
            itemHoverColor: "#1677ff",
            itemSelectedColor: "#1677ff",
            itemSelectedBg: "#e6f4ff",
        },
    },
};

const AppLayout: React.FC = () => {
    const { isAuthenticated, isLoading, user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [joinModalOpen, setJoinModalOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const getSelectedKey = () => {
        const path = location.pathname;
        if (path === "/") return "home";
        if (path === "/login") return "login";
        if (path === "/register") return "register";
        if (path === "/meetings") return "meetings";
        if (path === "/meetings/new") return "new-meeting";
        if (path === "/profile") return "profile";
        return "home";
    };

    const userMenuItems = [
        {
            key: "profile",
            icon: <UserOutlined />,
            label: "My Profile",
            onClick: () => navigate("/profile"),
        },
        {
            key: "settings",
            icon: <SettingOutlined />,
            label: "Settings",
            onClick: () => navigate("/profile"),
        },
        { type: "divider" as const },
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            danger: true,
            onClick: () => {
                logout();
                navigate("/");
            },
        },
    ];

    const guestMenuItems = [
        {
            key: "home",
            icon: <HomeOutlined />,
            label: "Home",
            onClick: () => navigate("/"),
        },
        {
            key: "login",
            icon: <UnlockOutlined />,
            label: "Login",
            onClick: () => navigate("/login"),
        },
        {
            key: "register",
            icon: <UserAddOutlined />,
            label: "Register",
            onClick: () => navigate("/register"),
        },
        { type: "divider" as const },
        {
            key: "join",
            icon: <VideoCameraOutlined />,
            label: "Join Meeting",
            onClick: () => setJoinModalOpen(true),
        },
    ];

    const authMenuItems = [
        {
            key: "home",
            icon: <HomeOutlined />,
            label: "Home",
            onClick: () => navigate("/"),
        },
        {
            key: "new-meeting",
            icon: <PlusCircleOutlined />,
            label: "New Meeting",
            onClick: () => navigate("/meetings/new"),
        },
        {
            key: "join",
            icon: <VideoCameraOutlined />,
            label: "Join Meeting",
            onClick: () => setJoinModalOpen(true),
        },
        {
            key: "meetings",
            icon: <CalendarOutlined />,
            label: "My Meetings",
            onClick: () => navigate("/meetings"),
        },
        { type: "divider" as const },
        {
            key: "profile",
            icon: <UserOutlined />,
            label: "Profile",
            onClick: () => navigate("/profile"),
        },
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            danger: true,
            onClick: () => {
                logout();
                navigate("/");
            },
        },
    ];

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <ConfigProvider theme={lightTheme}>
            <Layout style={{ minHeight: "100vh" }}>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    style={{
                        background: "#fff",
                        borderRight: "1px solid #e5e7eb",
                    }}
                    width={240}
                >
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <VideoCameraOutlined className="text-white text-lg" />
                            </div>
                            {!collapsed && (
                                <div>
                                    <h1 className="text-lg font-bold text-gray-900 leading-tight">
                                        Jitsi Meet
                                    </h1>
                                    <p className="text-xs text-gray-500">Video Conferencing</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <Menu
                        mode="inline"
                        selectedKeys={[getSelectedKey()]}
                        items={isAuthenticated ? authMenuItems : guestMenuItems}
                        style={{
                            border: "none",
                            padding: "8px",
                        }}
                    />
                </Sider>
                <Layout>
                    <Header
                        style={{
                            padding: "0 24px",
                            background: colorBgContainer,
                            borderBottom: "1px solid #e5e7eb",
                        }}
                        className="flex justify-between items-center"
                    >
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: "16px",
                                width: 48,
                                height: 48,
                            }}
                        />
                        <div className="flex items-center gap-4">
                            {isAuthenticated ? (
                                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                                    <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
                                        <Avatar
                                            size={36}
                                            style={{
                                                backgroundColor: "#1677ff",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {user?.name?.charAt(0).toUpperCase() || "U"}
                                        </Avatar>
                                        <div className="hidden md:block">
                                            <p className="text-sm font-medium text-gray-900 leading-tight">
                                                {user?.name || "User"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {user?.email || ""}
                                            </p>
                                        </div>
                                    </div>
                                </Dropdown>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button type="default" onClick={() => navigate("/login")}>
                                        Login
                                    </Button>
                                    <Button type="primary" onClick={() => navigate("/register")}>
                                        Get Started
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Header>

                    <Content
                        style={{
                            margin: "24px",
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: 12,
                            overflow: "hidden",
                        }}
                        className="shadow-sm"
                    >
                        <Outlet />
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
            <JoinMeetingModal
                open={joinModalOpen}
                onClose={() => setJoinModalOpen(false)}
            />
        </ConfigProvider>
    );
};

export default AppLayout;
