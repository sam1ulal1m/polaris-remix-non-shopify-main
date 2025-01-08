import { useNavigate } from '@remix-run/react';
import {
    Badge,
    Button,
    EmptySearchResult,
    IndexTable,
    LegacyCard,
    Text,
    useIndexResourceState,
} from '@shopify/polaris';

export default function SupportTickets({ tickets }) {
    const navigate = useNavigate()
    console.log('- 💎 file: CustomerTickets.tsx:11 💎 SupportTickets 💎 tickets:', tickets)

    const resourceName = {
        singular: 'ticket',
        plural: 'tickets',
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(tickets);

    const rowMarkup = tickets.map(
        ({ id, subject, description, status, updatedAt, executive }, index) => {
            const updatedDate = new Date(updatedAt);
            return (
                <IndexTable.Row
                    id={id}
                    key={id}
                    selected={selectedResources.includes(id)}
                    position={index}
                >
                    <IndexTable.Cell>
                        <Text variant="bodyMd" fontWeight="bold" as="span">
                            {subject}
                        </Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell>{description}</IndexTable.Cell>
                    <IndexTable.Cell>{status}</IndexTable.Cell>
                    <IndexTable.Cell>{updatedDate.toLocaleString()}</IndexTable.Cell>
                    <IndexTable.Cell>{executive}</IndexTable.Cell>
                    <IndexTable.Cell children={<Button onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/account/ticket/${id}`)
                    }} >View</Button>} />
                </IndexTable.Row>
            )
        },
    );

    const emptyStateMarkup = (
        <EmptySearchResult
            title={'No tickets yet'}
            description={'Try adding new tickets'}
            withIllustration
        />
    );

    return (
        <LegacyCard>
            <IndexTable
                emptyState={emptyStateMarkup}
                bulkActions={[]}
                resourceName={resourceName}
                itemCount={tickets.length}
                selectedItemsCount={
                    allResourcesSelected ? 'All' : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[
                    { title: 'Subject' },
                    { title: 'Description' },
                    { title: 'Status' },
                    { title: 'Last change' },
                    { title: 'Executive' },
                ]}
            >
                {rowMarkup}
            </IndexTable>
        </LegacyCard>
    );
}
