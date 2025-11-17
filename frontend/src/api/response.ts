import { unauthResponse } from "./authentication";

export function checkResponse(res:Response){
    if(!res.ok) 
    {
        unauthResponse(res);
        throw new Error(`HTTP ${res.status}`);
    }
}