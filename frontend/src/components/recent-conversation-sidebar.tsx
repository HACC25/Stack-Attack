import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { AppRecentConversationDropdown } from "./recent-conversation-dropdown";
import { Tooltip } from "./ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { AppRecentConversationTooltip } from "./recent-conversation-tooltips";
import React from "react";
import type { ApiChat } from "@/types/conversation";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useConversation } from "@/hooks/use-conversation";
import { useAuth } from "@/contexts/auth-context";


export function AppRecentConversationSidebar(){
    const {state} = useSidebar();
    
    const { token } = useAuth();
    const {chats, reloadChats, selectChat, createConversation, selectedChatId} = useConversation(token ?? "");

    // Listen for global chats-updated events so this sidebar can refresh when another hook instance updates chats
    // (useConversation is currently per-component; this allows simple cross-instance synchronization)
    React.useEffect(() => {
        const handler = () => {
            // call the hook's reload function to refresh local state
            reloadChats().catch(() => {});
        };
        window.addEventListener('app:chats-updated', handler as EventListener);
        return () => window.removeEventListener('app:chats-updated', handler as EventListener);
    }, [reloadChats]);

    const sort_chats = chats?.sort((a: ApiChat, b: ApiChat) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        if(dateA > dateB) return -1;
        else if(dateA < dateB) return 1;
        else return 0;
    })

    const isCollapsed = state === 'collapsed';
    
    return(
        <SidebarGroup>
            <SidebarGroupLabel className="flex">
                Recent
                <Button className="ml-auto !bg-transparent" size="icon-sm" variant="ghost"
                    onClick={async () => {
                        try {
                            const created = await createConversation();
                            // select the newly-created chat so the main view renders it
                            selectChat(created.chat_id);
                            window.dispatchEvent(new CustomEvent('app:selected-chat', { detail: { chat_id: created.chat_id } }));
                            // refresh chats list to ensure sidebar has the latest
                            reloadChats().catch(() => {});
                        } catch (e) {
                            console.error(e)
                        }
                    }}
                    aria-label="Create new conversation"
                >
                    <Plus />
                </Button>
            </SidebarGroupLabel>
            <SidebarGroupContent>
                {!isCollapsed&&(<SidebarMenu>
                {(sort_chats ?? []).map((Conversation: ApiChat) => (
                    <Tooltip key={Conversation.chat_id}>
                        <TooltipTrigger asChild>
                            <SidebarMenuItem key={Conversation.chat_id} className={selectedChatId === Conversation.chat_id ? "bg-blue-100 dark:bg-blue-800 cursor-pointer" : "cursor-pointer"} 
                                onClick={() => {
                                try {
                                    // notify other components about the selected chat
                                    window.dispatchEvent(new CustomEvent('app:selected-chat', { detail: { chat_id: Conversation.chat_id } }));
                                } catch (e) {}
                                // also set local selection
                                selectChat(Conversation.chat_id);
                            }}>

                                <SidebarMenuButton asChild>
                                    <div>
                                        <a className="truncate"><span className="truncate">{Conversation.title}</span></a>
                                        <div className="ml-auto">
                                            <AppRecentConversationDropdown chatId={Conversation.chat_id}/>
                                        </div>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </TooltipTrigger>
                        <AppRecentConversationTooltip conversationTimestamp={new Date(Conversation.created_at)} conversationTitle={Conversation.title}/>
                    </Tooltip>
                ))}
                </SidebarMenu>)}
            </SidebarGroupContent>
            </SidebarGroup>
    )
}