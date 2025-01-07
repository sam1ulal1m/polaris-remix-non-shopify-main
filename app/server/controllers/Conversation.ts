import { Conversation } from "../models/Conversation";

interface ConversationData {
    ticketId: string;
    customerEmail: string;
    messages: Record<string, string>;
    endedAt?: Date;
}

export const getConversationByTicketId = async (ticketId: string) => {
    try {
        console.log("Fetching conversation for Ticket ID:", ticketId);
        
        // Fetch the first conversation for the given ticket ID
        const conversation = await Conversation.findFirst({
            where: { ticketId },
        });

        if (conversation) {
            return { success: true, conversation };
        } else {
            return { success: false, error: 'No conversation found for this ticket.' };
        }
    } catch (error) {
        console.log("Error retrieving conversation:", error);
        return { success: false, error };
    }
};
export const updateConversation = async (conversationId: string, updateData: Partial<ConversationData>) => {
    try {
        const updatedConversationResponse = await Conversation.update({
            where: {
                id: conversationId,
            },
            data: updateData,
        });

        if (updatedConversationResponse) {
            return { success: true, updatedConversationResponse };
        } else {
            return { success: false, error: 'Conversation not found' };
        }
    } catch (error) {
        console.log("Error updating conversation:", error);
        return { success: false, error };
    }
};

export const createConversation = async (conversationData: ConversationData) => {
    try {
        const { ticketId, customerEmail, messages, endedAt } = conversationData;

        // Create the conversation in the database
        const newConversationResponse = await Conversation.create({
            data: {
                ticketId,
                customerEmail,
                messages,
                endedAt,
            },
        });

        if (newConversationResponse?.id) {
            console.log("Conversation created:", newConversationResponse.id);
            return { success: true, newConversationResponse };
        } else {
            throw new Error(JSON.stringify(newConversationResponse));
        }
    } catch (error) {
        console.log("Error creating conversation:", error);
        return { success: false, error };
    }
};

