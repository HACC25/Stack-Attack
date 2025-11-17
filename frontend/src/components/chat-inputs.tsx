import { useState } from 'react';
import { Field } from '@/components/ui/field';
import { Card } from "@/components/ui/card";
import { FileButton } from "./file-button";
import { DictationButton } from "./dictation-button";
import TextInput from './text-input';
import { QuickChatButton, type QuickChatButtonProp } from './quick-chat-input';
import { Button } from './ui/button';
import { Send } from 'lucide-react';

const QuickchatButton_Example: QuickChatButtonProp[] = [{
    cardTitle:"Blue Collar Worker"
},
{
    cardTitle: "White Collar Worker"
}]

export function AppChatInput({ onSend, sending, disabled }: { onSend: (content: string) => Promise<void> | void; sending: boolean; disabled?: boolean }) {
    const [value, setValue] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = value.trim();
        if (!trimmed || sending || disabled) return;
        await onSend(trimmed);
        setValue("");
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Enter to send and Shift+Enter for newline
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const trimmed = value.trim();
            if (!trimmed || sending || disabled) return;
            await onSend(trimmed);
            setValue("");
        }
    };

    return (
        <div className='m-5 flex flex-col gap-2'>
            <div className='flex justify-center gap-3'>
                {QuickchatButton_Example.map((quickActionButton) => (
                    <QuickChatButton key={quickActionButton.cardTitle} cardTitle={quickActionButton.cardTitle} cardDescription={quickActionButton.cardDescription} />
                ))}
            </div>
            <Card className='p-2'>
                <form onSubmit={handleSubmit}>
                    <Field>
                        <div className='flex items-end gap-2'>
                            {/* <FileButton /> */}
                            <TextInput value={value} onChange={setValue} disabled={!!disabled} onKeyDown={handleKeyDown} />
                            {/* <DictationButton /> */}
                            <Button
                                type="submit"
                                size="icon-sm"
                                aria-label="Send message"
                                variant="ghost"
                                className="!bg-transparent"
                                disabled={!!disabled || sending || !value.trim()}
                                title={sending ? 'Sending…' : 'Send message'}
                            >
                                <Send />
                            </Button>
                        </div>
                    </Field>
                </form>
            </Card>
        </div>
    );
}