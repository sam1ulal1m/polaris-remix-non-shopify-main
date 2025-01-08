import { Form, useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { BlockStack, Box, Button, Combobox, EmptyState, FormLayout, Icon, InlineStack, LegacyStack, Listbox, Select, Tag, Text, TextContainer, TextField } from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createConversation, getConversationByTicketId } from "~/server/controllers/Conversation";
import { createMessage, getMessagesByConversationId } from "~/server/controllers/Message";
import { getTicketById, updateTicket } from "~/server/controllers/TicketController";

export default function EditTicket() {
  const { serialisedUser: userData, isAdmin } = useOutletContext();
  const executives = useMemo(
    () => [
      { value: 'joe', label: 'Joe' },
      { value: 'alice', label: 'Alice' },
    ],
    [],
  );

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const createConversationFetcher = useFetcher({ key: 'createConversation' })
  const updateTicketFetcher = useFetcher({ key: 'updateTicket' })
  const sendMessageFetcher = useFetcher({ key: 'sendMessage' })
  const [message, setMessage] = useState('')
  const { ticketData, conversations: { conversation, success }, messages } = useLoaderData() || {}

  const { ticket: { subject, description, status, customer, createdAt, executive } } = ticketData || {}
  const [localExecutives, setLocalExecutive] = useState(executive)
  const [localStatus, setLocalStatus] = useState(status)
  const createdDate = new Date(createdAt)

  const scrollToBottom = useCallback(() => {
    const lastMessageContainer = document.getElementById(messages?.messages[messages?.messages.length - 1]?.id);
    if (lastMessageContainer) {
      lastMessageContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }
    , [messages])
  useEffect(() => {
    if (messages?.success && messages?.messages?.length > 0) scrollToBottom()
  }
    , [messages, scrollToBottom])




  const createNewConversation = useCallback(() => {
    createConversationFetcher.submit({
      actionType: 'createConversation',
      ticketId: ticketData?.ticket?.id,
      customerEmail: customer
    }, { method: 'post', action: `/account/ticket/${ticketData?.ticket?.id}` })
  }
    , [createConversationFetcher, ticketData, customer])

  const sendMesasge = useCallback((e) => {
    e.preventDefault()
    sendMessageFetcher.submit({
      actionType: 'sendMessage',
      conversationId: conversation.id,
      sender: userData?.emailAddresses?.find(email => email?.id === userData?.primaryEmailAddressId)?.emailAddress,
      message
    }, { method: 'post', action: `/account/ticket/${ticketData?.ticket?.id}` })
    if (sendMessageFetcher.state === 'idle') {
      setMessage('')
    }
  }
    , [sendMessageFetcher, conversation, message, ticketData?.ticket?.id, userData])

  const updateTicket = useCallback(() => {
    updateTicketFetcher.submit({
      actionType: 'updateTicket',
      ticketId: ticketData?.ticket?.id,
      status: localStatus,
      executive: localExecutives,
    }, { method: 'post', action: `/account/ticket/${ticketData?.ticket?.id}` })
  }
    , [updateTicketFetcher, ticketData, localStatus, localExecutives])





  return (
    <Box >
      <BlockStack gap="100">
        <InlineStack align="space-between" gap={"200"}>
          {
            isAdmin ? <Box>Update Ticket</Box> : <Box>View Ticket</Box>
          }
          <InlineStack gap={"200"}>
            <Text tone="subdued" variant="bodySm" as="h2">Customer: {customer}</Text>
            <Text tone="subdued" variant="bodySm" as="h2">Openned At: {createdDate.toLocaleDateString()}</Text>
          </InlineStack>
        </InlineStack>
        <FormLayout>
          <TextField
            label="Subject"
            autoComplete="off"
            readOnly
            type="text" onChange={(v) => {
              console.log('v:', v)
            }}
            value={subject}
          />
          <TextField
            multiline={4}
            label="Description"
            autoComplete="off"
            readOnly
            type="text" onChange={(v) => {
              console.log('v:', v)
            }}
            value={description}
          />
          <Select
            disabled={!isAdmin}
            options={[
              { label: 'Open', value: 'OPEN' },
              { label: 'In Progress', value: 'IN_PROGRESS' },
              { label: 'Resolved', value: 'RESOLVED' },
              { label: 'Closed', value: 'CLOSED' },
            ]}
            label="Status"
            value={localStatus}
            onChange={(value) => {
              setLocalStatus(value)
            }}
          />
          <Select
            disabled={!isAdmin}
            options={[
              { label: 'John', value: 'john' },
              { label: 'Alice', value: 'alice' },
            ]}
            label="Assign to"
            value={localExecutives}
            onChange={(value) => {
              console.log('value:', value)
              setLocalExecutive(value)
            }}
          />
          {isAdmin &&
            <Button onClick={updateTicket} variant="primary" >Update</Button>
          }
        </FormLayout>
        <FormLayout>
          <Text as="h2" >
            Thread
          </Text>
          <BlockStack gap="200">
            {!success ?
              <EmptyState
                heading=" No conversation yet"
                action={{ content: 'Start a new conversation', onAction: () => createNewConversation() }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>Track, recieve , reply to the ticket by the users.</p>
              </EmptyState>
              :
              <div style={{
                minHeight: '200px',
                maxHeight: '300px',
                border: '1px solid #dfe3e8',
                borderRadius: '4px',
                padding: '10px',
                overflowY: 'scroll',
                backgroundColor: '#f9fafb'
              }}>


                {messages?.messages?.length > 0 && messages?.messages.map((message) => {
                  return (
                    <BlockStack key={message.id} >
                      <InlineStack align={customer === message?.sender ? "start" : "end"} gap="200">
                        {/* <BlockStack>
                          <Text as="p">{message.sender}</Text>
                          <Text as="p">{message.createdAt}</Text>
                        </BlockStack> */}
                        <BlockStack>
                          <div style={{
                            padding: '10px',
                            borderRadius: '4px',
                            backgroundColor: customer === message?.sender ? '#f4defc' : '#e5f9f6',
                          }} >
                            <p id={message.id} >{message.content}</p>
                          </div>
                        </BlockStack>
                      </InlineStack>
                    </BlockStack>
                  )
                }
                )}


              </div>

            }
            {success && conversation ? <BlockStack >
              <Form onSubmit={sendMesasge}  >
                <TextField
                  name="message"
                  value={message}
                  type="text"
                  onChange={setMessage}
                  autoComplete="off"
                  connectedRight={<Button submit variant="primary">Reply</Button>}
                />
              </Form>

            </BlockStack> : null}

          </BlockStack>
        </FormLayout>
      </BlockStack>
    </Box>
  )
}

export async function loader({ request, params }: { request: Request, params: any }) {
  try {
    const ticketId = params?.ticketId
    const ticketData = await getTicketById(ticketId)
    const conversations = await getConversationByTicketId(ticketId)
    let messages = []
    if (conversations.success) {
      messages = await getMessagesByConversationId(conversations.conversation.id)
    }
    return { ticketData, conversations, messages }
  } catch (error) {
    return { error }
  }

}

export async function action({ request, params }: { request: Request, params: any }) {
  try {

    const formData = await request.formData();
    const actionType = formData.get('actionType');
    switch (actionType) {
      case 'createConversation': {
        const ticketId = String(formData.get('ticketId'));
        const customerEmail = formData.get('customerEmail') as string;
        const response = await createConversation({
          ticketId, customerEmail, messages: JSON.stringify({}), endedAt: new Date().toISOString()
        })
        if (!response.success) {
          throw new Error(response.error)
        }
        return { success: true, conversation: response.conversation }
      }
      case 'sendMessage': {
        const conversationId = String(formData.get('conversationId'));
        const message = formData.get('message') as string;
        const sender = formData.get('sender') as string;
        const response = await createMessage({
          content: message, sender, conversationId
        })
        if (!response.success) {
          throw new Error(response.error)
        }
        return { success: true, message: response.message }
      }
      case 'updateTicket': {
        const ticketId = String(formData.get('ticketId'));
        const status = formData.get('status') as string;
        const executive = formData.get('executive') as string;
        const response = await updateTicket(ticketId, { status, executive })
        if (!response.success) {
          throw new Error(response.error)
        }
        return { success: true, ticket: response.updatedTicketResponse }
      }
    }
  } catch (error) {
    return { error }

  }

}
