import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/remix';
import { createClerkClient } from '@clerk/remix/api.server';
import { getAuth } from '@clerk/remix/ssr.server';
import { redirect } from '@remix-run/node';
import { BlockStack, Box, Card, Page } from '@shopify/polaris';
import { LoaderFunction, Outlet, useLoaderData } from 'react-router';
import AppFrame from '~/components/AppFrame';

export default function Account() {
  const { serialisedUser, isAdmin } = useLoaderData()
  console.log('- 💎 file: account.tsx:11 💎 Account 💎 isAdmin:', isAdmin)
  console.log('- 💎 file: account.tsx:11 💎 Account 💎 serialisedUser:', serialisedUser)
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
              <SignedIn>
                <p>You are signed in!</p>

                <UserButton />
              </SignedIn>
              <SignedOut>
                <p>You are signed out</p>

                <SignInButton />
              </SignedOut>
            </div>
            <Box>
              <Outlet context={{ serialisedUser, isAdmin }} />
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
  const isAdmin = user?.emailAddresses?.find(email => email?.id === user?.primaryEmailAddressId)?.emailAddress === "samiul@devsnest.llc"

  return { serialisedUser: JSON.stringify(user), isAdmin }
}