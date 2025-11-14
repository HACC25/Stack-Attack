import { useEffect, useState, type ReactNode } from "react";

type AuthGuardProps = {
    children: ReactNode;
    redirectUrl?: string;
    tokenKey?: string;
};

export function AuthGuard({
    children,
    redirectUrl = "http://localhost:8000/login",
    tokenKey = "access_token",
}: AuthGuardProps) {
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
    const token = localStorage.getItem(tokenKey);
    if (!token) {
        window.location.replace(redirectUrl);
        return;
    }
    setAuthorized(true);
    }, [redirectUrl, tokenKey]);

    if (!authorized) return null; // or a small loader
    return <>{children}</>;
}