import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuGroup, DropdownMenuLabel } from "./ui/dropdown-menu";
import { EllipsisVertical, Pin, Trash2 } from "lucide-react";
import { Card } from "./ui/card";
import { useAuth } from "@/contexts/auth-context";
import { deleteChat, pinChat } from "@/api/conversations";
import React from "react";

export function AppRecentConversationDropdown({ chatId }: { chatId: string }){
    const { token } = useAuth();

    const onDelete = React.useCallback(async () => {
        if (!token) return;
        try {
            await deleteChat(token, chatId);
            try { window.dispatchEvent(new CustomEvent('app:chats-updated', { detail: { source: 'deleteConversation', chat_id: chatId } })); } catch (e) {}
        } catch (err) {
            console.error('Failed to delete chat', err);
        }
    }, [token, chatId]);

    const onPin = React.useCallback(async () => {
        if (!token) return;
        try {
            await pinChat(token, chatId);
            try { window.dispatchEvent(new CustomEvent('app:chats-updated', { detail: { source: 'pinConversation', chat_id: chatId } })); } catch (e) {}
        } catch (err) {
            console.error('Failed to pin chat', err);
        }
    }, [token, chatId]);

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                    <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent side={"right"} align={"start"} className="min-w-56 rounded-lg">
                <Card className="py-1">
                    <DropdownMenuGroup>
                    <DropdownMenuLabel>Conversation Settings</DropdownMenuLabel>
                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); onDelete(); }} className="focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"> <Trash2 /> Delete Conversation</DropdownMenuItem>
                    <DropdownMenuCheckboxItem onSelect={(e) => { e.preventDefault(); onPin(); }}><Pin /> Pin Conversation</DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
                </Card>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}