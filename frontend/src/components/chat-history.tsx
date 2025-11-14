import {Message} from "@/components/chat-message"
import type { MessageProp } from "@/components/chat-message"

const example_Messages:MessageProp[] = [
    {
        message_id: "90917c27-6866-4a4f-8a06-5b42e5ff96c9",
        sent_by_user: false,
        content: "Aloha! 🌈 I’m Kōkua, here to help you with questions about your employment benefits under the University of Hawai‘i’s collective bargaining agreements. How can I help you today?",
        timestamp: new Date("2025-11-02T19:01:10.000Z")
    },

    {
        message_id: "dff94ce9-3d22-4100-a0f4-9992a4dc48ac",
        sent_by_user: true,
        content: "Aloha, Kōkua. I’m a Blue-Collar Supervisor with UH Facilities, and I wanted to know if I can take time off if my child passes away.",
        timestamp: new Date("2025-11-02T19:09:11.000Z")
    },

    {
        message_id:"8391d467-e4cc-4f34-8c8b-e087d4123b84",
        sent_by_user: false,
        content: "I’m so sorry for your loss, Kaleo. 💐 According to Article 37 – Funeral Leave of the Unit 2 Agreement (Blue-Collar Supervisors, 2021–2025), you are eligible for up to three (3) working days of paid funeral leave for the death of an immediate family member, which includes your child",
        timestamp: new Date("2025-11-02T19:12:12.000Z")
    },

    {
        message_id:"190dfe37-03fc-4e48-afc9-ab9fface11b2",
        sent_by_user: true,
        content: "Mahalo. Do I need to use my vacation or sick leave for those days?",
        timestamp: new Date("2025-11-02T19:16:13.000Z")
    },

    {
        message_id:"c3299f9e-0aca-44c8-b738-7631a165e05e",
        sent_by_user: false,
        content: "No, you don’t. Funeral leave under Article 37 is separate from sick or vacation leave. It’s a paid leave benefit specifically for this type of situation. However, you’ll need to notify your supervisor as soon as possible and may be asked to provide reasonable documentation (such as a death notice or service program).",
        timestamp: new Date ("2025-11-02T19:17:14.000Z")
    },

    {
        message_id:"d6dda3f4-d790-46b2-a2a0-3ad2b4bd8589",
        sent_by_user: true,
        content: "Okay, understood. What if I need more than three days?",
        timestamp: new Date ("2025-11-02T19:19:15.000Z")
    },

    {
        message_id:"9ad23747-1fdc-4aec-98c5-26a6113b7bc9",
        sent_by_user: false,
        content: "If you need additional time, you may request vacation leave or leave without pay beyond the three days. Approval for those requests depends on departmental needs and policies, but I can help you prepare that request if you’d like.",
        timestamp: new Date ("2025-11-02T19:20:16.000Z")
    },

    {
        message_id:"6aad1b82-640a-49dc-a79c-6f51013dfff1",
        sent_by_user: true,
        content: "That would be great, mahalo nui loa.",
        timestamp: new Date ("2025-11-02T19:40:18.000Z")
    },

    {
        message_id:"de65a085-39a7-4902-9643-55160d4bf971",
        sent_by_user: false,
        content: "You’re very welcome, Kaleo. 🌺 Take care of yourself and your ‘ohana during this time. When you’re ready, I can guide you through submitting your funeral leave request through the UH leave system.",
        timestamp: new Date ("2025-11-02T19:55:19.000Z")
    }
]


export function AppChatHistory(){
    const chatHistoryMessage = example_Messages.sort((a:MessageProp, b:MessageProp) => {
        if(a.timestamp > b.timestamp) return 1;
        else if (b.timestamp > a.timestamp) return -1;
        else return 0;
    }).map((message) => {
        return <Message key={message.message_id} message_id={message.message_id} content={message.content} timestamp={message.timestamp} sent_by_user={message.sent_by_user}></Message>
    });

    return (
        <div className="chat-history flex flex-col gap-20">
            {chatHistoryMessage}
        </div>
    );
}