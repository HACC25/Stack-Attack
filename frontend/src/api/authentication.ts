import { apiRequestCallback } from "./api";
import { checkResponse } from "./response";

export const login = (token: string, email: string, name: string) => {
        localStorage.setItem("access_token", token);
        localStorage.setItem("user_email", email);
        localStorage.setItem("user_name", name);
}


export const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_name");
        window.location.href = "http://localhost:8000/login";
    };


export async function checkAuthStatus(){
        const currentToken = localStorage.getItem("access_token");
        const res = await apiRequestCallback("/usage/global", {
                method: "GET",
                baseUrl: "http://localhost:8000",
                token: currentToken??"",
            });
        checkResponse(res);
        
    }


export async function unauthResponse(res: Response) {
    if (res.status === 401) {
        logout();
        throw new Error("Unauthorized - session expired");
    }
}