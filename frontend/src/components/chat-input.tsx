import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import {
    Card,
    CardContent
} from "@/components/ui/card"
import { useRef } from "react";

export function AppChatInput(){
    return(
    <div>
        <Card>
            <Button size="icon-sm" aria-label="Submit" variant="outline"></Button>
            <Textarea>Enter your question!</Textarea>
            <Button size="icon-sm" aria-label="Submit" variant="outline"></Button>
        </Card>
    </div>
    );
}