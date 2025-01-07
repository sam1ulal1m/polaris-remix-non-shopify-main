import { prisma } from "../db.server";


interface MessageData {
    content: string;
    sender: string;
    conversationId: string;
    metadata?: Record<string, any>;
}

export const getMessagesByConversationId = async (conversationId: string) => {
    try {
        console.log("Fetching messages for Conversation ID:", conversationId);

        // Retrieve messages for the given conversation ID
        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { sentAt: 'asc' }, // Sort messages by sent time in ascending order
        });

        if (messages.length > 0) {
            return { success: true, messages };
        } else {
            return { success: false, error: 'No messages found for this conversation.' };
        }
    } catch (error) {
        console.log("Error retrieving messages:", error);
        return { success: false, error: error.message };
    }
};




export const createMessage = async (messageData: MessageData) => {
    try {
        const { content, sender, conversationId, metadata } = messageData;

        // Create a new message in the database
        const newMessage = await prisma.message.create({
            data: {
                content,
                sender,
                conversationId,
                metadata,
            },
        });

        console.log("Message created:", newMessage.id);
        return { success: true, message: newMessage };
    } catch (error) {
        console.log("Error creating message:", error);
        return { success: false, error: error.message };
    }
};