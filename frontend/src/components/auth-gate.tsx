import { useAuth } from "@/contexts/auth-context";
import type { ReactNode } from "react";

export function AuthGate({ children }: { children: ReactNode }){
    const {  loading, error } = useAuth();
    if(loading) return(<div>Loading...</div>)
    if(error) return (<div>{`Error: ${error}`}</div>)
    return(
        <>{children}</>
    )
}