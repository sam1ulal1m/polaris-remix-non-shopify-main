// Desc: Controller for ticket related operations
import { Ticket } from '../models/TicketModel';

interface TicketData {
    subject: string;
    description: string;
    customer: string;
    executive: string;
    status?: 'OPEN' | 'CLOSED' | 'IN_PROGRESS' | 'RESOLVED';
}

export const createTicket = async (ticketData: TicketData) => {
    try {
        const { subject, description, customer, executive, status = 'OPEN' } = ticketData;
        // Create the ticket in the database
        const newTicketResponse = await Ticket.create({
            data: {
                subject,
                description,
                customer,
                executive,
                status,
            },
        });
        if (newTicketResponse?.id) {
            console.log("Ticket created:", newTicketResponse.id);
            return { success: true, newTicketResponse };
        } else {
            throw new Error(JSON.stringify(newTicketResponse));
        }
    } catch (error) {
        console.log("Error creating ticket:", error);
        return { success: false, error };
    }
};

export const getTicketById = async (id: string) => {
    try {
        console.log("Ticket ID:", id);
        const ticket = await Ticket.findUnique({
            where: {
                id,
            },
        });
        return ticket ? { success: true, ticket } : { success: false, error: 'Ticket not found' };
    } catch (error) {
        console.log("Error retrieving ticket:", error);
        return { success: false, error };
    }
};

export const updateTicket = async (id: string, updateData: Partial<TicketData>) => {
    try {
        console.log("updated data for ticket:", updateData);
        const updatedTicketResponse = await Ticket.update({
            where: {
                id,
            },
            data: updateData,
        });
        return { success: true, updatedTicketResponse };
    } catch (error) {
        console.log("Error updating ticket:", error);
        return { success: false, error };
    }
};

export const deleteTicket = async (id: number) => {
    try {
        await Ticket.delete({
            where: {
                id,
            },
        });
        return { success: true, message: 'Ticket deleted successfully' };
    } catch (error) {
        console.log("Error deleting ticket:", error);
        return { success: false, error };
    }
};

export const getAllTickets = async () => {
    try {
        const tickets = await Ticket.findMany();
        return { success: true, tickets };
    } catch (error) {
        console.log("Error retrieving tickets:", error);
        return { success: false, error };
    }
};
