import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuGroup, DropdownMenuLabel } from "./dropdown-menu";
import { EllipsisVertical, Pin, Trash2 } from "lucide-react";
import { Card } from "./card";

export function AppRecentConversationDropdown(){
    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                    <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent side={"right"} align={"start"} className="min-w-56 rounded-lg">
                <Card className="py-1">
                    <DropdownMenuGroup>
                    <DropdownMenuLabel>Conversation Settings</DropdownMenuLabel>
                    <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"> <Trash2 /> Delete Conversation</DropdownMenuItem>
                    <DropdownMenuCheckboxItem><Pin /> Pin Conversation</DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
                </Card>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}