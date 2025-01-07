import { useFetcher, useOutletContext } from '@remix-run/react';
import {
    Button,
    Checkbox,
    LegacyStack,
    Modal,
    TextField
} from '@shopify/polaris';
import { PlusIcon } from '@shopify/polaris-icons';
import { useCallback, useState } from 'react';

export default function CreateCustomerTicket() {
    const createTicket = useFetcher();
    const { serialisedUser, isAdmin } = useOutletContext();
    const userData =serialisedUser;
    const [active, setActive] = useState(false);
    const [checked, setChecked] = useState(false);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = useCallback((value: string, key: string) => {
        if (key === 'subject') {
            setSubject(value);
        }
        if (key === 'description') {
            setDescription(value);
        }
    }, []);

    const toggleActive = useCallback(() => setActive((active) => !active), []);
    const handleCheckbox = useCallback((value: boolean) => setChecked(value), []);

    const submitTicket = useCallback(async () => {
        setIsLoading(true);
        if (!checked) {
            alert('You must agree to the terms of service.');
            return;
        }

        if (!subject || !description) {
            alert('Please fill in all fields.');
            return;
        }

        createTicket.submit(
            {
                actionType: 'createTicket',
                subject,
                description,
                customer: userData?.emailAddresses?.find(email => email?.id === userData?.primaryEmailAddressId)?.emailAddress,
                executive: isAdmin ? 'Admin User' : 'Default Executive',
            },
            { method: 'post', action: '/account/tickets' }
        );
        if (createTicket.state === 'idle') {
            setSubject('');
            setDescription('');
            setChecked(false);
            setTimeout(() => {
                setIsLoading(false);
                toggleActive();
            }, 1000);
        }
    }, [subject, description, checked, createTicket, userData, isAdmin, toggleActive]);

    const activator = (
        <Button onClick={toggleActive} icon={PlusIcon}>
            New Ticket
        </Button>
    );

    if (!serialisedUser) return null;

    return (
        <div>
            <Modal
                size="large"
                activator={activator}
                open={active}
                onClose={toggleActive}
                title="Create a new ticket"
                primaryAction={{
                    content: 'Create',
                    onAction: submitTicket,
                    loading: isLoading,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: toggleActive,
                    },
                ]}
            >
                <Modal.Section>
                    <LegacyStack vertical>
                        <TextField
                            label="Subject"
                            value={subject}
                            onChange={(value) => handleChange(value, 'subject')}
                            autoComplete="off"
                        />
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(value) => handleChange(value, 'description')}
                            multiline={4}
                            autoComplete="off"
                        />
                        <TextField
                            readOnly
                            label="Customer"
                            value={`${userData?.firstName} ${userData?.lastName} (${userData?.emailAddresses[0]?.emailAddress})`}
                            autoComplete="off"
                        />
                        <Checkbox
                            checked={checked}
                            label="I agree to the terms of service"
                            onChange={handleCheckbox}
                        />
                    </LegacyStack>
                </Modal.Section>
            </Modal>
        </div>
    );
}
