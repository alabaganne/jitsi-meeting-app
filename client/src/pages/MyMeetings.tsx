import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Card,
    Table,
    Tag,
    Dropdown,
    Empty,
    Modal,
    message,
    Input,
    Tabs,
} from "antd";
import {
    PlusOutlined,
    VideoCameraOutlined,
    MoreOutlined,
    DeleteOutlined,
    CopyOutlined,
    EditOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuth } from "../context/AuthContext";
import { Meeting } from "../types";

dayjs.extend(relativeTime);

// Sample meetings data for demonstration
const sampleMeetings: Meeting[] = [
    {
        id: "1",
        name: "Team Weekly Standup",
        roomName: "jitsi-abc123",
        organizerId: 1,
        organizerName: "John Doe",
        description: "Weekly team sync to discuss progress and blockers",
        scheduledAt: dayjs().add(1, "day").toISOString(),
        duration: 30,
        isActive: true,
        createdAt: dayjs().subtract(2, "day").toISOString(),
    },
    {
        id: "2",
        name: "Project Review",
        roomName: "jitsi-def456",
        organizerId: 1,
        organizerName: "John Doe",
        description: "Review Q4 project deliverables",
        scheduledAt: dayjs().add(3, "day").toISOString(),
        duration: 60,
        isActive: true,
        createdAt: dayjs().subtract(1, "day").toISOString(),
    },
    {
        id: "3",
        name: "Client Demo",
        roomName: "jitsi-ghi789",
        organizerId: 1,
        organizerName: "John Doe",
        description: "Product demonstration for client",
        scheduledAt: dayjs().subtract(1, "day").toISOString(),
        duration: 45,
        isActive: false,
        createdAt: dayjs().subtract(5, "day").toISOString(),
    },
];

const MyMeetings: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [meetings, setMeetings] = useState<Meeting[]>(sampleMeetings);
    const [loading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [activeTab, setActiveTab] = useState("upcoming");

    const filteredMeetings = meetings.filter((meeting) => {
        const matchesSearch =
            meeting.name.toLowerCase().includes(searchText.toLowerCase()) ||
            meeting.roomName.toLowerCase().includes(searchText.toLowerCase());

        if (activeTab === "upcoming") {
            return matchesSearch && dayjs(meeting.scheduledAt).isAfter(dayjs());
        } else if (activeTab === "past") {
            return matchesSearch && dayjs(meeting.scheduledAt).isBefore(dayjs());
        }
        return matchesSearch;
    });

    const handleJoinMeeting = (roomName: string) => {
        navigate(`/meet/${roomName}`, {
            state: { displayName: user?.name },
        });
    };

    const handleCopyLink = (roomName: string) => {
        const link = `${window.location.origin}/meet/${roomName}`;
        navigator.clipboard.writeText(link);
        message.success("Meeting link copied to clipboard!");
    };

    const handleDeleteMeeting = (id: string) => {
        Modal.confirm({
            title: "Delete Meeting",
            content: "Are you sure you want to delete this meeting?",
            okText: "Delete",
            okType: "danger",
            onOk: () => {
                setMeetings(meetings.filter((m) => m.id !== id));
                message.success("Meeting deleted successfully");
            },
        });
    };

    const getMenuItems = (meeting: Meeting) => [
        {
            key: "join",
            icon: <VideoCameraOutlined />,
            label: "Join Meeting",
            onClick: () => handleJoinMeeting(meeting.roomName),
        },
        {
            key: "copy",
            icon: <CopyOutlined />,
            label: "Copy Link",
            onClick: () => handleCopyLink(meeting.roomName),
        },
        {
            key: "edit",
            icon: <EditOutlined />,
            label: "Edit",
            onClick: () => message.info("Edit feature coming soon"),
        },
        { type: "divider" as const },
        {
            key: "delete",
            icon: <DeleteOutlined />,
            label: "Delete",
            danger: true,
            onClick: () => handleDeleteMeeting(meeting.id),
        },
    ];

    const columns = [
        {
            title: "Meeting",
            dataIndex: "name",
            key: "name",
            render: (name: string, record: Meeting) => (
                <div>
                    <p className="font-medium text-gray-900 mb-1">{name}</p>
                    <p className="text-sm text-gray-500">{record.roomName}</p>
                </div>
            ),
        },
        {
            title: "Date & Time",
            dataIndex: "scheduledAt",
            key: "scheduledAt",
            render: (date: string) => (
                <div>
                    <p className="text-gray-900">
                        {dayjs(date).format("MMM DD, YYYY")}
                    </p>
                    <p className="text-sm text-gray-500">
                        {dayjs(date).format("h:mm A")}
                    </p>
                </div>
            ),
        },
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
            render: (duration: number) => (
                <span className="text-gray-600">
                    {duration >= 60 ? `${duration / 60}h` : `${duration}m`}
                </span>
            ),
        },
        {
            title: "Status",
            key: "status",
            render: (_: any, record: Meeting) => {
                const isUpcoming = dayjs(record.scheduledAt).isAfter(dayjs());
                const isNow =
                    dayjs(record.scheduledAt).isBefore(dayjs()) &&
                    dayjs(record.scheduledAt)
                        .add(record.duration || 60, "minute")
                        .isAfter(dayjs());

                if (isNow) {
                    return <Tag color="green">In Progress</Tag>;
                } else if (isUpcoming) {
                    return <Tag color="blue">Upcoming</Tag>;
                }
                return <Tag color="default">Completed</Tag>;
            },
        },
        {
            title: "",
            key: "actions",
            width: 120,
            render: (_: any, record: Meeting) => (
                <div className="flex gap-2">
                    <Button
                        type="primary"
                        size="small"
                        icon={<VideoCameraOutlined />}
                        onClick={() => handleJoinMeeting(record.roomName)}
                    >
                        Join
                    </Button>
                    <Dropdown menu={{ items: getMenuItems(record) }} trigger={["click"]}>
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        My Meetings
                    </h1>
                    <p className="text-gray-500">
                        Manage and join your scheduled meetings
                    </p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/meetings/new")}
                    size="large"
                >
                    New Meeting
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="border-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <CalendarOutlined className="text-2xl text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {meetings.filter((m) =>
                                    dayjs(m.scheduledAt).isAfter(dayjs())
                                ).length}
                            </p>
                            <p className="text-gray-500">Upcoming Meetings</p>
                        </div>
                    </div>
                </Card>
                <Card className="border-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <ClockCircleOutlined className="text-2xl text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {meetings.reduce((acc, m) => acc + (m.duration || 0), 0)}
                            </p>
                            <p className="text-gray-500">Total Minutes</p>
                        </div>
                    </div>
                </Card>
                <Card className="border-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <TeamOutlined className="text-2xl text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {meetings.length}
                            </p>
                            <p className="text-gray-500">Total Meetings</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Meetings Table */}
            <Card className="border-0 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={[
                            { key: "upcoming", label: "Upcoming" },
                            { key: "past", label: "Past" },
                            { key: "all", label: "All" },
                        ]}
                    />
                    <Input
                        placeholder="Search meetings..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-64"
                    />
                </div>

                {filteredMeetings.length > 0 ? (
                    <Table
                        columns={columns}
                        dataSource={filteredMeetings}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: false,
                        }}
                    />
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div className="text-center">
                                <p className="text-gray-500 mb-4">
                                    {searchText
                                        ? "No meetings found matching your search"
                                        : "No meetings scheduled yet"}
                                </p>
                                {!searchText && (
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => navigate("/meetings/new")}
                                    >
                                        Create Your First Meeting
                                    </Button>
                                )}
                            </div>
                        }
                    />
                )}
            </Card>
        </div>
    );
};

export default MyMeetings;
