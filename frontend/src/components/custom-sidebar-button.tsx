import { useRef } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";

export function SidebarButton(){
const fileSidebarTriggerRef = useRef<HTMLButtonElement | null>(null);

    const handleButtonClick = () => {
        if (fileSidebarTriggerRef.current) {
            fileSidebarTriggerRef.current.click();
        }
    };

    return(
        <>
            <SidebarTrigger className="sr-only" ref={fileSidebarTriggerRef}/>
            <Button variant="ghost" className="!bg-transparent" size="icon-sm" onClick={handleButtonClick}>
                    <Menu/>
            </Button>
        </>
    )
}