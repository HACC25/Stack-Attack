export type ApiMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

interface RequestOptions {
    method: ApiMethod
    token?: string
    body?: any
    query?: Record<string, any>
    headers?: Record<string, string>
    singal?: AbortSignal
    baseUrl: string
}

/*
    How to use:
        - endpoint param does not expect `localhost:8000` part of api url. Just the api route name

    const response = await apiRequestCallback("/path/to/route", {
        method: "GET" | "POST" | "DELETE" | "PATCH",  // Required HTTP method
        baseUrl: "https://api.example.com",           // Required base URL for the request (for us: localhost:8000)
        token: "your-auth-token",                     // Optional, for routes requiring authentication
        body: { key: value },                         // Optional, request body for POST, PATCH, etc.
        query: { param1: "value1", param2: [1, 2] },   // Optional, query parameters (support for arrays too)
        headers: { "Custom-Header": "value" },        // Optional, additional headers (just ignore for now tbh)
        singal: abortController.signal                // Optional, to cancel request with AbortController
    });


    if (!response.ok){
        // got an error reponse from the backend. Throw an error!
    }

    data = await response.json()  <--- the JSON_Response from the backend.
    
    Notes:
    - If `token` is undefined or null, the Authorization header is omitted.
    - Query parameters are serialized and appended to the URL.
    - Request body is automatically stringified if provided.
*/


export async function apiRequestCallback(endpoint: string, options: RequestOptions): Promise<Response> {
    const url = new URL(endpoint, options.baseUrl)

    if (options.query){
        Object.entries(options.query).forEach(([key, value]) => {
            if (Array.isArray(value)){
                value.forEach((v) => {
                    url.searchParams.append(key, String(v))
                })
            } else if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value))
            }
        })
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.token ? { 'Authorization': `Bearer ${options.token}` } : {}),
        ...options.headers
    }

    const res = await fetch(url.toString(), {
        method: options.method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: options.singal
    })

    return res
}