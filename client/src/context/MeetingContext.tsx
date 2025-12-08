import { createContext, useContext, useReducer, ReactNode } from "react";
import { Meeting, CreateMeetingPayload } from "../types";
import { meetingService } from "../services/api";
import { message } from "antd";
import { v4 as uuidv4 } from "uuid";

interface MeetingState {
    meetings: Meeting[];
    currentMeeting: Meeting | null;
    isLoading: boolean;
}

interface MeetingContextType extends MeetingState {
    fetchMeetings: () => Promise<void>;
    createMeeting: (payload: CreateMeetingPayload) => Promise<Meeting | null>;
    getMeeting: (id: string) => Promise<Meeting | null>;
    deleteMeeting: (id: string) => Promise<boolean>;
    setCurrentMeeting: (meeting: Meeting | null) => void;
    generateQuickMeeting: (name: string) => Meeting;
}

type MeetingAction =
    | { type: "SET_MEETINGS"; payload: Meeting[] }
    | { type: "ADD_MEETING"; payload: Meeting }
    | { type: "REMOVE_MEETING"; payload: string }
    | { type: "SET_CURRENT_MEETING"; payload: Meeting | null }
    | { type: "SET_LOADING"; payload: boolean };

const initialState: MeetingState = {
    meetings: [],
    currentMeeting: null,
    isLoading: false,
};

function meetingReducer(state: MeetingState, action: MeetingAction): MeetingState {
    switch (action.type) {
        case "SET_MEETINGS":
            return { ...state, meetings: action.payload, isLoading: false };
        case "ADD_MEETING":
            return { ...state, meetings: [action.payload, ...state.meetings] };
        case "REMOVE_MEETING":
            return {
                ...state,
                meetings: state.meetings.filter((m) => m.id !== action.payload),
            };
        case "SET_CURRENT_MEETING":
            return { ...state, currentMeeting: action.payload };
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        default:
            return state;
    }
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export function MeetingProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(meetingReducer, initialState);

    const fetchMeetings = async () => {
        dispatch({ type: "SET_LOADING", payload: true });
        try {
            const response = await meetingService.getMeetings();
            if (response.success && response.data) {
                dispatch({ type: "SET_MEETINGS", payload: response.data });
            } else {
                dispatch({ type: "SET_LOADING", payload: false });
            }
        } catch (error) {
            dispatch({ type: "SET_LOADING", payload: false });
            message.error("Failed to fetch meetings");
        }
    };

    const createMeeting = async (payload: CreateMeetingPayload): Promise<Meeting | null> => {
        try {
            const response = await meetingService.createMeeting(payload);
            if (response.success && response.data) {
                dispatch({ type: "ADD_MEETING", payload: response.data });
                message.success("Meeting created successfully!");
                return response.data;
            } else {
                message.error(response.message || "Failed to create meeting");
                return null;
            }
        } catch (error) {
            message.error("Failed to create meeting");
            return null;
        }
    };

    const getMeeting = async (id: string): Promise<Meeting | null> => {
        try {
            const response = await meetingService.getMeeting(id);
            if (response.success && response.data) {
                return response.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    };

    const deleteMeeting = async (id: string): Promise<boolean> => {
        try {
            const response = await meetingService.deleteMeeting(id);
            if (response.success) {
                dispatch({ type: "REMOVE_MEETING", payload: id });
                message.success("Meeting deleted successfully");
                return true;
            }
            return false;
        } catch (error) {
            message.error("Failed to delete meeting");
            return false;
        }
    };

    const setCurrentMeeting = (meeting: Meeting | null) => {
        dispatch({ type: "SET_CURRENT_MEETING", payload: meeting });
    };

    const generateQuickMeeting = (name: string): Meeting => {
        const roomName = `jitsi-${uuidv4().slice(0, 8)}`;
        return {
            id: uuidv4(),
            name: name || "Quick Meeting",
            roomName,
            organizerId: 0,
            isActive: true,
            createdAt: new Date().toISOString(),
        };
    };

    return (
        <MeetingContext.Provider
            value={{
                ...state,
                fetchMeetings,
                createMeeting,
                getMeeting,
                deleteMeeting,
                setCurrentMeeting,
                generateQuickMeeting,
            }}
        >
            {children}
        </MeetingContext.Provider>
    );
}

export function useMeeting() {
    const context = useContext(MeetingContext);
    if (context === undefined) {
        throw new Error("useMeeting must be used within a MeetingProvider");
    }
    return context;
}

export default MeetingContext;
