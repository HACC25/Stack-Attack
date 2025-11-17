import { apiRequestCallback } from "./api";
import { checkResponse } from "./response";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const LOGIN_REDIRECT = import.meta.env.VITE_LOGIN_REDIRECT_URL;

export const login = (token: string, email: string, name: string) => {
        localStorage.setItem("access_token", token);
        localStorage.setItem("user_email", email);
        localStorage.setItem("user_name", name);
}


export const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_name");
        window.location.href = LOGIN_REDIRECT;
    };


export async function checkAuthStatus(){
        const currentToken = localStorage.getItem("access_token");
        const res = await apiRequestCallback("/usage/global", {
                method: "GET",
                baseUrl: BACKEND_URL,
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