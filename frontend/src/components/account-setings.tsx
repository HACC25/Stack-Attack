import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { PopoverContent } from "./ui/popover";

export function AccountSettingsPopover(){
    return(
        <PopoverContent>
            <Card>
                <CardHeader>Account Settings</CardHeader>
                <CardContent>
                    <Button>Sign Out</Button>
                </CardContent>
            </Card>
        </PopoverContent>
    )
}