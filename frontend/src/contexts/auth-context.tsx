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
        // 1) Try to parse auth details from URL (callback flow)
        try {
            const url = new URL(window.location.href);
            const search = url.searchParams;
            const hashParams = url.hash ? new URLSearchParams(url.hash.replace(/^#\/?/, "")) : undefined;

            const tokenParam = search.get("token") || search.get("access_token") || hashParams?.get("token") || hashParams?.get("access_token");
            const emailParam = search.get("email") || search.get("user_email") || hashParams?.get("email") || hashParams?.get("user_email");
            const nameParam = search.get("name") || search.get("user_name") || hashParams?.get("name") || hashParams?.get("user_name");

            if (tokenParam) {
                // Persist what we have; prefer using helper when all values present
                if (emailParam && nameParam) {
                    login(tokenParam, emailParam, nameParam);
                    setToken(tokenParam);
                    setUser({ email: emailParam, name: nameParam });
                } else {
                    // Store token only; user can be fetched later via checkAuth()
                    localStorage.setItem("access_token", tokenParam);
                    setToken(tokenParam);
                }

                // Clean URL of secrets
                ["token", "access_token", "email", "user_email", "name", "user_name"].forEach((k) => search.delete(k));
                url.search = search.toString();
                url.hash = "";
                const clean = url.pathname + (url.search ? `?${url.search}` : "");
                window.history.replaceState(null, "", clean);
            } else {
                // 2) Fallback to localStorage
                const savedToken = localStorage.getItem("access_token");
                const savedEmail = localStorage.getItem("user_email");
                const savedName = localStorage.getItem("user_name");

                if (savedToken) {
                    setToken(savedToken);
                    if (savedEmail && savedName) {
                        setUser({ email: savedEmail, name: savedName });
                    }
                }
            }
        } finally {
            setLoading(false);
        }
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