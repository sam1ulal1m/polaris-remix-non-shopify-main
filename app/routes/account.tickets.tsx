import { useOutletContext } from '@remix-run/react';
import { BlockStack, Box, InlineStack } from '@shopify/polaris';
import CreateCustomerTicket from '~/components/CreateCustomerTicket';
import CustomerTickets from '~/components/CustomerTickets';
import ManageTickets from '~/components/ManageTickets';
import { createTicket, deleteTicket } from '~/server/controllers/TicketController';

export default function Tickets() {
    const { isAdmin, tickets } = useOutletContext() || {};
    if (!isAdmin) return (
        <BlockStack gap={"100"} >
            <InlineStack align='space-between'  >
                <Box>
                    Tickets
                </Box>
                <CreateCustomerTicket />
            </InlineStack>
            <CustomerTickets tickets={tickets} />
        </BlockStack>
    )
    return (
        <BlockStack gap={"100"} >
            <InlineStack align='space-between'  >
                <Box>
                    Manage Tickets
                </Box>
                {/* <CreateCustomerTicket /> */}
            </InlineStack>
            <ManageTickets tickets={tickets} />
        </BlockStack>
    )
}


export async function action({ request }: { request: Request }) {
    const formData = await request.formData();
    const actionType = formData.get('actionType');

    try {
        switch (actionType) {
            case 'createTicket': {
                const subject = formData.get('subject') as string;
                const description = formData.get('description') as string;
                const customer = formData.get('customer') as string;
                const executive = formData.get('executive') as string;

                const response = await createTicket({
                    subject,
                    description,
                    customer,
                    executive,
                });

                if (!response.success) {
                    throw new Error(response.error);
                }
                return { success: true, ticket: response.newTicketResponse };
            }
            case 'deleteTicket': {
                const ticketId = Number(formData.get('ticketId'));
                const response = await deleteTicket(ticketId);

                if (!response.success) {
                    throw new Error(response.error);
                }
                return { success: true, message: response.message };
            }
            default:
                throw new Error('Invalid action type');
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

