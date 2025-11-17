
import { useId } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function TextInput({
    value,
    onChange,
    disabled,
    onKeyDown,
}: {
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
    onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) {
    const id = useId();
    return (
        <div className="grow">
            <Textarea
                placeholder="Ask your question!"
                id={id}
                rows={1}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                onKeyDown={onKeyDown}
                className="bg-inherit border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 resize-none h-auto min-h-[13px]"
            />
        </div>
    );
}