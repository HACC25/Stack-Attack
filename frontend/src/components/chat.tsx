import { AppChatHistory } from "./chat-history";
import { AppChatInput } from "./chat-inputs";

export function AppChat(){
    return(
        <div>
            <AppChatHistory></AppChatHistory>
            <div className="sticky bottom-15">
            <AppChatInput ></AppChatInput>
            </div>
        </div>
    );
}