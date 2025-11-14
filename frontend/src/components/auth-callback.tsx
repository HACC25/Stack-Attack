import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";


export function AuthCallback() {
    const { setAuth } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const email = params.get("email");
        const name = params.get("name");

        if (token && email && name) {
        setAuth(token, email, name);
        window.location.href = "/";
        }
    }, [setAuth]);

    return <div>Completing login...</div>;
}