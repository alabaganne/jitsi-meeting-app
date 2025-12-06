// User types
export interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    avatar?: string;
    createdAt?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// Meeting types
export interface Meeting {
    id: string;
    name: string;
    roomName: string;
    organizerId: number;
    organizerName?: string;
    description?: string;
    scheduledAt?: string;
    duration?: number;
    isActive: boolean;
    createdAt: string;
    invitees?: Invitee[];
}

export interface Invitee {
    email: string;
    name?: string;
    status: "pending" | "accepted" | "declined";
}

export interface CreateMeetingPayload {
    name: string;
    description?: string;
    scheduledAt?: string;
    duration?: number;
    inviteeEmails?: string[];
}

// Auth types
export interface LoginPayload {
    username: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    message: string;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// Jitsi types
export interface JitsiConfig {
    roomName: string;
    displayName: string;
    email?: string;
    subject?: string;
    password?: string;
}
