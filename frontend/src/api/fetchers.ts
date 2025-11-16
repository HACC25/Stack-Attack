import { apiRequestCallback } from "./api"

const BACKEND_URL = import.meta.env.BACKEND_URL

export const fetch_chats = async () => {
    await apiRequestCallback("/chats/", {
        method: "GET",
        baseUrl: BACKEND_URL,
        token: undefined
    })
}