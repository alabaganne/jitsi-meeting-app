import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyMeetings from "./pages/MyMeetings";
import NewMeeting from "./pages/NewMeeting";
import MyProfile from "./pages/MyProfile";
import Meet from "./pages/Meet";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "", element: <Home /> },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            {
                path: "meetings",
                element: (
                    <ProtectedRoute>
                        <MyMeetings />
                    </ProtectedRoute>
                ),
            },
            {
                path: "meetings/new",
                element: (
                    <ProtectedRoute>
                        <NewMeeting />
                    </ProtectedRoute>
                ),
            },
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <MyProfile />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: "/meet/:roomId",
        element: <Meet />,
    },
]);

export default router;
