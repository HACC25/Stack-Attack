import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type User = {
    email: string;
    name: string;
};

type AuthContextType = {
    token: string | null;
    user: User | null;
    setAuth: (token: string, email: string, name: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem("access_token");
        const savedEmail = localStorage.getItem("user_email");
        const savedName = localStorage.getItem("user_name");

        if (savedToken && savedEmail && savedName) {
        setToken(savedToken);
        setUser({ email: savedEmail, name: savedName });
        }
    }, []);

    const setAuth = (token: string, email: string, name: string) => {
        localStorage.setItem("access_token", token);
        localStorage.setItem("user_email", email);
        localStorage.setItem("user_name", name);
        setToken(token);
        setUser({ email, name });
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_name");
        setToken(null);
        setUser(null);
        window.location.href = "http://localhost:8000/login";
    };

    return (
        <AuthContext.Provider value={{ token, user, setAuth, logout }}>
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