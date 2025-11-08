import { AppChatHistory } from "./chat-history";
import { AppChatInput } from "./chat-input";

export function AppChat(){
    return(
        <div>
            <AppChatHistory></AppChatHistory>
            <AppChatInput></AppChatInput>
        </div>
    );
}