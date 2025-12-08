import {
    ApiResponse,
    AuthResponse,
    LoginPayload,
    RegisterPayload,
    Meeting,
    CreateMeetingPayload,
    User,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || "An error occurred",
                error: data.error,
            };
        }

        return {
            success: true,
            data: data.data || data,
            message: data.message,
        };
    } catch (error) {
        return {
            success: false,
            message: "Network error. Please check your connection.",
            error: String(error),
        };
    }
}

export const authService = {
    async login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
        return fetchWithAuth<AuthResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> {
        return fetchWithAuth<AuthResponse>("/auth/register", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async getProfile(): Promise<ApiResponse<User>> {
        return fetchWithAuth<User>("/auth/profile");
    },

    async updateProfile(payload: Partial<User>): Promise<ApiResponse<User>> {
        return fetchWithAuth<User>("/auth/profile", {
            method: "PUT",
            body: JSON.stringify(payload),
        });
    },

    async changePassword(payload: {
        currentPassword: string;
        newPassword: string;
    }): Promise<ApiResponse<{ message: string }>> {
        return fetchWithAuth<{ message: string }>("/auth/change-password", {
            method: "PUT",
            body: JSON.stringify(payload),
        });
    },
};

export const meetingService = {
    async getMeetings(): Promise<ApiResponse<Meeting[]>> {
        return fetchWithAuth<Meeting[]>("/meetings");
    },

    async getMeeting(id: string): Promise<ApiResponse<Meeting>> {
        return fetchWithAuth<Meeting>(`/meetings/${id}`);
    },

    async createMeeting(payload: CreateMeetingPayload): Promise<ApiResponse<Meeting>> {
        return fetchWithAuth<Meeting>("/meetings", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async updateMeeting(
        id: string,
        payload: Partial<CreateMeetingPayload>
    ): Promise<ApiResponse<Meeting>> {
        return fetchWithAuth<Meeting>(`/meetings/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
        });
    },

    async deleteMeeting(id: string): Promise<ApiResponse<{ message: string }>> {
        return fetchWithAuth<{ message: string }>(`/meetings/${id}`, {
            method: "DELETE",
        });
    },

    async joinMeeting(roomName: string): Promise<ApiResponse<Meeting>> {
        return fetchWithAuth<Meeting>(`/meetings/join/${roomName}`);
    },
};

export default {
    authService,
    meetingService,
};
