import { Search } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    useSidebar
} from "@/components/ui/sidebar"
import { AppRecentConversationSidebar } from "./recent-conversation-sidebar"
import { AppAccountSidebar } from "./account-sidebar"
import { Button } from "./ui/button"
import { SidebarButton } from "./custom-sidebar-button"
import { useAuth } from "../contexts/auth-context"

export function AppSidebar() {
    const {state} = useSidebar();
    const { user } = useAuth();

    const isCollapsed = state === 'collapsed';
    return (
        <Sidebar variant="floating" collapsible="icon">
        <SidebarHeader className="!flex-row justify-between">
            <SidebarButton/>
            {
                !isCollapsed && 
                <Button variant="ghost" size="icon-sm">
                    <Search/>
                </Button>
            }
        </SidebarHeader>
        <SidebarContent>
            <AppRecentConversationSidebar></AppRecentConversationSidebar>
        </SidebarContent>
        <SidebarFooter>
            <AppAccountSidebar name={user?.name ?? ""} email={user?.email ?? ""} department={""} ></AppAccountSidebar>
        </SidebarFooter>
        </Sidebar>
    )
}