import { apiRequestCallback } from "./api";
import { checkResponse } from "./response";

export const createChat = async (token: string) => {
    const res = await apiRequestCallback("/chats/", {
        method: "POST",
        baseUrl: "http://localhost:8000",
        token,
    });
    checkResponse(res)
    return res;
};

export const fetchChats = async (token: string): Promise<Response> => {
    const res = await apiRequestCallback("/chats/", {
        method: "GET",
        baseUrl: "http://localhost:8000",
        token,
    });
    checkResponse(res)
    return res;
};

export const fetchMessages = async (token:string, chat_id:string): Promise<Response> => {
    const res = await apiRequestCallback("/messages/", {
        method:"GET",
        baseUrl: "http://localhost:8000",
        token,
        query:{
            chat_id: chat_id
        }
    })
    checkResponse(res)
    return res;
}