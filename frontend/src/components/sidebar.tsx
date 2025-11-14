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
import type { AccountProp } from "@/components/account-sidebar"
import { Button } from "./ui/button"
import { SidebarButton } from "./custom-sidebar-button"

const example_account:AccountProp = {
        name: "Kaleo Smith",
        email: "kaleo.smith@hawaii.edu",
        department: "Department",
}

export function AppSidebar() {
    const {state} = useSidebar();

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
            <AppAccountSidebar name={example_account.name} email={example_account.email} department={example_account.department} ></AppAccountSidebar>
        </SidebarFooter>
        </Sidebar>
    )
}