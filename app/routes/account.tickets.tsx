import { useOutletContext } from '@remix-run/react'
import { BlockStack, Box, Button, InlineStack } from '@shopify/polaris'
import {
    PlusIcon
} from '@shopify/polaris-icons';
import CustomerTickets from '~/components/CustomerTickets'

export default function Tickets() {
    const { serialisedUser, isAdmin } = useOutletContext()
    if (!isAdmin) return (
        <BlockStack gap={"100"} >
            <InlineStack align='space-between'  >
                <Box>
                    Tickets
                </Box>
                <Button
                    icon={PlusIcon}
                >
                    New Ticket
                </Button>
            </InlineStack>
            <CustomerTickets />
        </BlockStack>
    )
    return (
        <div>Manage tickets</div>
    )
}

