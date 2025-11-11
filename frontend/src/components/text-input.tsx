
import { useId} from "react"
import { Textarea } from "@/components/ui/textarea"
export default function TextInput() {
    const id = useId()
    return (
        <div className="grow">
            <Textarea 
                placeholder="Ask your question!" 
                id={id}
                resize-y
                rows={1}
                className="bg-inherit border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 resize-none h-auto min-h-[13px]"
                resize-none
            />
        </div>
    )
}