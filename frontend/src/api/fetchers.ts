import { apiRequestCallback } from "./api"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const LOGIN_REDIRECT = import.meta.env.VITE_LOGIN_REDIRECT_URL

export const login_redirect = () => {
    window.location = LOGIN_REDIRECT
}

export const fetch_chats = async () => {
    const response = await apiRequestCallback("/chats/", {
        method: "GET",
        baseUrl: BACKEND_URL,
        token: undefined
    })

    // 403 == user not in db, 401 == token invalid / unauthorized
    if (!response.ok && (response.status === 403 || response.status === 401)){ 
        // Redirect to login url
        login_redirect()
    }

    return response
}