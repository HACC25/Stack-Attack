import { useAuth } from "../contexts/auth-context";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { PopoverContent } from "./ui/popover";

export function AccountSettingsPopover(){
    const {logout} = useAuth();
    return(
        <PopoverContent>
            <Card>
                <CardHeader>Account Settings</CardHeader>
                <CardContent>
                    <Button onClick={logout}>Sign Out</Button>
                </CardContent>
            </Card>
        </PopoverContent>
    )
}