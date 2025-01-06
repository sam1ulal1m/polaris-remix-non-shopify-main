import {
    Badge,
    IndexTable,
    LegacyCard,
    Text,
    useIndexResourceState,
} from '@shopify/polaris';

export default function SupportTickets() {
    const tickets = [
        {
            id: 'T001',
            subject: 'Login Issue',
            description: 'Customer cannot log into their account.',
            status: <Badge status="attention">Open</Badge>,
            customer: 'Jaydon Stanton',
            executive: 'Alice Johnson',
        },
        {
            id: 'T002',
            subject: 'Payment Error',
            description: 'Payment failed during checkout.',
            status: <Badge status="success">Resolved</Badge>,
            customer: 'Ruben Westerfelt',
            executive: 'Mark Smith',
        },
        {
            id: 'T003',
            subject: 'Order Not Delivered',
            description: 'Customer reports order not received.',
            status: <Badge status="critical">Closed</Badge>,
            customer: 'Leo Carder',
            executive: 'Emily Davis',
        },
    ];

    const resourceName = {
        singular: 'ticket',
        plural: 'tickets',
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(tickets);

    const rowMarkup = tickets.map(
        ({ id, subject, description, status, customer, executive }, index) => (
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
                <IndexTable.Cell>{customer}</IndexTable.Cell>
                <IndexTable.Cell>{executive}</IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    return (
        <LegacyCard>
            <IndexTable
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
                    { title: 'Customer' },
                    { title: 'Executive' },
                ]}
            >
                {rowMarkup}
            </IndexTable>
        </LegacyCard>
    );
}
