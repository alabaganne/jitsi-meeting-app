import { RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";
import router from "./router";
import { AuthProvider } from "./context/AuthContext";
import { MeetingProvider } from "./context/MeetingContext";

const theme = {
    token: {
        colorPrimary: "#1677ff",
        borderRadius: 8,
        fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
    },
};

function App() {
    return (
        <ConfigProvider theme={theme}>
            <AuthProvider>
                <MeetingProvider>
                    <RouterProvider router={router} />
                </MeetingProvider>
            </AuthProvider>
        </ConfigProvider>
    );
}

export default App;
