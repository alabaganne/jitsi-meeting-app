import { useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Spin, message } from "antd";
import {
    ArrowLeftOutlined,
    CopyOutlined,
    ShareAltOutlined,
} from "@ant-design/icons";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useAuth } from "../context/AuthContext";

const Meet: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const apiRef = useRef<any>(null);

    const displayName = (location.state as { displayName?: string })?.displayName ||
        (isAuthenticated ? user?.name : "Guest");

    const handleCopyLink = () => {
        const meetingUrl = window.location.href;
        navigator.clipboard.writeText(meetingUrl);
        message.success("Meeting link copied to clipboard!");
    };

    const handleApiReady = (apiObj: any) => {
        apiRef.current = apiObj;
        setIsLoading(false);

        apiObj.addListener("videoConferenceLeft", () => {
            navigate("/");
        });

        apiObj.addListener("readyToClose", () => {
            navigate("/");
        });
    };

    const handleReadyToClose = () => {
        navigate("/");
    };

    if (!roomId) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Invalid Meeting
                    </h2>
                    <p className="text-gray-500 mb-6">
                        No meeting room ID was provided.
                    </p>
                    <Button type="primary" onClick={() => navigate("/")}>
                        Go Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-gray-900">
            {/* Meeting Header */}
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate("/")}
                        className="text-white hover:text-blue-400"
                    >
                        Leave
                    </Button>
                    <div className="hidden sm:block">
                        <p className="text-white font-medium">Meeting: {roomId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        type="text"
                        icon={<CopyOutlined />}
                        onClick={handleCopyLink}
                        className="text-white hover:text-blue-400"
                    >
                        <span className="hidden sm:inline">Copy Link</span>
                    </Button>
                    <Button
                        type="text"
                        icon={<ShareAltOutlined />}
                        onClick={handleCopyLink}
                        className="text-white hover:text-blue-400"
                    >
                        <span className="hidden sm:inline">Share</span>
                    </Button>
                </div>
            </div>

            {/* Jitsi Meeting Container */}
            <div className="flex-1 relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                        <div className="text-center">
                            <Spin size="large" />
                            <p className="text-white mt-4">Connecting to meeting...</p>
                        </div>
                    </div>
                )}
                <JitsiMeeting
                    domain="meet.jit.si"
                    roomName={roomId}
                    configOverwrite={{
                        startWithAudioMuted: true,
                        startWithVideoMuted: false,
                        disableModeratorIndicator: true,
                        enableEmailInStats: false,
                        prejoinPageEnabled: true,
                        disableDeepLinking: true,
                        enableWelcomePage: false,
                        enableClosePage: false,
                        disableInviteFunctions: false,
                        toolbarButtons: [
                            "camera",
                            "chat",
                            "closedcaptions",
                            "desktop",
                            "download",
                            "embedmeeting",
                            "etherpad",
                            "feedback",
                            "filmstrip",
                            "fullscreen",
                            "hangup",
                            "help",
                            "highlight",
                            "invite",
                            "linktosalesforce",
                            "livestreaming",
                            "microphone",
                            "noisesuppression",
                            "participants-pane",
                            "profile",
                            "raisehand",
                            "recording",
                            "security",
                            "select-background",
                            "settings",
                            "shareaudio",
                            "sharedvideo",
                            "shortcuts",
                            "stats",
                            "tileview",
                            "toggle-camera",
                            "videoquality",
                            "whiteboard",
                        ],
                    }}
                    interfaceConfigOverwrite={{
                        DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
                        MOBILE_APP_PROMO: false,
                        SHOW_CHROME_EXTENSION_BANNER: false,
                        SHOW_JITSI_WATERMARK: false,
                        SHOW_POWERED_BY: false,
                        SHOW_PROMOTIONAL_CLOSE_PAGE: false,
                        VIDEO_LAYOUT_FIT: "both",
                        HIDE_INVITE_MORE_HEADER: false,
                        TOOLBAR_ALWAYS_VISIBLE: false,
                        DEFAULT_BACKGROUND: "#1a1a2e",
                    }}
                    userInfo={{
                        displayName: displayName || "Guest",
                        email: isAuthenticated && user?.email ? user.email : "",
                    }}
                    onApiReady={handleApiReady}
                    onReadyToClose={handleReadyToClose}
                    getIFrameRef={(iframeRef) => {
                        iframeRef.style.height = "100%";
                        iframeRef.style.width = "100%";
                    }}
                />
            </div>
        </div>
    );
};

export default Meet;
