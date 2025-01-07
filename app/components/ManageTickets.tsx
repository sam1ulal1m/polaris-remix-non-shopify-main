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

export default function ManageTickets({ tickets }) {
    const navigate = useNavigate();
    const resourceName = {
        singular: 'ticket',
        plural: 'tickets',
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(tickets);

    const rowMarkup = tickets.map(
        ({ id, subject, description, status, updatedAt, executive, customer }, index) => {
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
                    <IndexTable.Cell>{status}</IndexTable.Cell>
                    <IndexTable.Cell>{customer}</IndexTable.Cell>
                    <IndexTable.Cell>{updatedDate.toLocaleString()}</IndexTable.Cell>
                    <IndexTable.Cell>{executive}</IndexTable.Cell>
                    <IndexTable.Cell children={<Button variant='primary' onClick={(e) => {
                        // stop event propagation
                        e.stopPropagation();
                        navigate('/account/ticket/' + id);
                    }} >Edit</Button>} />
                </IndexTable.Row>
            )
        },
    );
    const bulkActions = [
        {
            content: 'Edit',
            onAction: () => console.log('yeeee'),
        }]
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
                sortable={[true, false, false, true, false, false]}
                emptyState={emptyStateMarkup}
                bulkActions={bulkActions}
                resourceName={resourceName}
                itemCount={tickets.length}
                selectedItemsCount={
                    allResourcesSelected ? 'All' : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[
                    { title: 'Subject' },
                    { title: 'Status' },
                    { title: 'Customer' },
                    { title: 'Last change' },
                    { title: 'Executive' },
                    { title: 'Action' },
                ]}
            >
                {rowMarkup}
            </IndexTable>
        </LegacyCard>
    );
}
