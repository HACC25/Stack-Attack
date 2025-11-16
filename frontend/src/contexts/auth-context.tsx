import { apiRequestCallback } from "@/api/api";
import { login, logout as AuthLogOut } from "@/api/authentication";
import { createContext, useState, useEffect, useContext, type ReactNode } from "react"

type User = {
    email: string;
    name: string;
};

type AuthContextType = {
    token: string | null;
    user: User | null;
    loading: boolean;
    error: string | null;
    setAuth: (token: string, email: string, name: string) => void;
    checkAuth: () => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: ReactNode }){
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem("access_token");
        const savedEmail = localStorage.getItem("user_email");
        const savedName = localStorage.getItem("user_name");

        if (savedToken && savedEmail && savedName) {
            setToken(savedToken);
            setUser({ email: savedEmail, name: savedName });
        }
        setLoading(false);
    }, []);

    const setAuth = (token: string, email: string, name: string) => {
        login(token, email, name);
        setToken(token);
        setUser({ email, name });
    };

    const checkAuth = async () => {
        if (!token) return;
        
        try {
            setError(null);
            const res = await apiRequestCallback("/usage/user", {
                method: "GET",
                baseUrl: "http://localhost:8000",
                token: token,
            });
            
            if (!res.ok) {
                setError("Session expired");
                logout();
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Auth check failed";
            console.error("Auth check failed:", err);
            setError(errorMsg);
            logout();
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        AuthLogOut();
    };

    useEffect(() => {
        if (!token) return;

        const interval = setInterval(() => {
            checkAuth();
        }, 300000);

        return () => clearInterval(interval);
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, user, loading, error, setAuth, checkAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}