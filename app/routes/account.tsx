import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/remix';
import { createClerkClient } from '@clerk/remix/api.server';
import { getAuth } from '@clerk/remix/ssr.server';
import { redirect } from '@remix-run/node';
import { BlockStack, Box, Card, Divider, InlineStack, Page } from '@shopify/polaris';
import { LoaderFunction, Outlet, useLoaderData } from 'react-router';
import AppFrame from '~/components/AppFrame';
import { Ticket } from '~/server/models/TicketModel';

export default function Account() {
  const { serialisedUser, isAdmin, tickets } = useLoaderData() || {};
  return (
    <AppFrame>
      <Page title="Account">
        <Card >
          <BlockStack gap={"100"}>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
            }}>
              <h1>Your account</h1>
              <InlineStack blockAlign='center' gap={"100"}>
                <SignedIn>
                  <p>You are signed in!</p>

                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <p>You are signed out</p>

                  <SignInButton />
                </SignedOut>
              </InlineStack>
            </div>
            <Divider />
            <Box>
              <Outlet context={{ serialisedUser, isAdmin, tickets }} />
            </Box>
          </BlockStack>

        </Card>
      </Page>
    </AppFrame>
  );
}


export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args)
  if (!userId) {
    return redirect('/sign-in')
  }

  // Initialize clerkClient and perform an operation
  const user = await createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }).users.getUser(
    userId,
  )
  const primaryEmail = user?.emailAddresses?.find(email => email?.id === user?.primaryEmailAddressId)?.emailAddress
  const isAdmin = primaryEmail === "samiul@devsnest.llc"
  let tickets = []
  if (!isAdmin) {
    tickets = await Ticket.findMany({
      where: {
        customer: primaryEmail,
      },
    });
  } else {
    tickets = await Ticket.findMany();
  }

  return { serialisedUser: user, isAdmin, tickets };
}

