import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import type { ReactNode } from "react";

export function AuthGate({ children }: { children: ReactNode }) {
    const { token, loading, error, logout } = useAuth();

    useEffect(() => {
        if (!loading && !token) {
            // No session -> redirect to backend login
            logout();
        }
    }, [loading, token, logout]);

    if (loading) return <div>Loading…</div>;
    if (error) return <div>{`Error: ${error}`}</div>;
    if (!token) return <div>Redirecting to sign in…</div>;

    return <>{children}</>;
}