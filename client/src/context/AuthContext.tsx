import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { User, AuthState, LoginPayload, RegisterPayload } from "../types";
import { authService } from "../services/api";
import { message } from "antd";

interface AuthContextType extends AuthState {
    login: (payload: LoginPayload) => Promise<boolean>;
    register: (payload: RegisterPayload) => Promise<boolean>;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
}

type AuthAction =
    | { type: "AUTH_START" }
    | { type: "AUTH_SUCCESS"; payload: { user: User; token: string } }
    | { type: "AUTH_FAILURE" }
    | { type: "LOGOUT" }
    | { type: "UPDATE_USER"; payload: Partial<User> }
    | { type: "SET_LOADING"; payload: boolean };

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "AUTH_START":
            return { ...state, isLoading: true };
        case "AUTH_SUCCESS":
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
            };
        case "AUTH_FAILURE":
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            };
        case "LOGOUT":
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            };
        case "UPDATE_USER":
            return {
                ...state,
                user: state.user ? { ...state.user, ...action.payload } : null,
            };
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        default:
            return state;
    }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("token");
            const userData = localStorage.getItem("user");

            if (token && userData) {
                try {
                    const user = JSON.parse(userData);
                    dispatch({ type: "AUTH_SUCCESS", payload: { user, token } });
                } catch {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    dispatch({ type: "AUTH_FAILURE" });
                }
            } else {
                dispatch({ type: "SET_LOADING", payload: false });
            }
        };

        initAuth();
    }, []);

    const login = async (payload: LoginPayload): Promise<boolean> => {
        dispatch({ type: "AUTH_START" });
        try {
            const response = await authService.login(payload);
            if (response.success && response.data) {
                const { user, token } = response.data;
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                dispatch({ type: "AUTH_SUCCESS", payload: { user, token } });
                message.success("Login successful!");
                return true;
            } else {
                dispatch({ type: "AUTH_FAILURE" });
                message.error(response.message || "Login failed");
                return false;
            }
        } catch (error) {
            dispatch({ type: "AUTH_FAILURE" });
            message.error("Login failed. Please try again.");
            return false;
        }
    };

    const register = async (payload: RegisterPayload): Promise<boolean> => {
        dispatch({ type: "AUTH_START" });
        try {
            const response = await authService.register(payload);
            if (response.success && response.data) {
                const { user, token } = response.data;
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                dispatch({ type: "AUTH_SUCCESS", payload: { user, token } });
                message.success("Registration successful!");
                return true;
            } else {
                dispatch({ type: "AUTH_FAILURE" });
                message.error(response.message || "Registration failed");
                return false;
            }
        } catch (error) {
            dispatch({ type: "AUTH_FAILURE" });
            message.error("Registration failed. Please try again.");
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
        message.success("Logged out successfully");
    };

    const updateUser = (userData: Partial<User>) => {
        if (state.user) {
            const updatedUser = { ...state.user, ...userData };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            dispatch({ type: "UPDATE_USER", payload: userData });
        }
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export default AuthContext;
