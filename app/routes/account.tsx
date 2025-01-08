import { SignedIn, SignedOut, SignInButton, UserButton , useUser} from '@clerk/remix';
import { createClerkClient } from '@clerk/remix/api.server';
import { getAuth } from '@clerk/remix/ssr.server';
import { redirect } from '@remix-run/node';
import { Form, useFetcher } from '@remix-run/react';
import { BlockStack, Box, Button, Card, Divider, InlineStack, Page, Select } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import { LoaderFunction, Outlet, useLoaderData, useNavigate } from 'react-router';
import AppFrame from '~/components/AppFrame';
import { getUserTypeByEmail, updateUserType } from '~/server/controllers/UserController';
import { Ticket } from '~/server/models/TicketModel';

export default function Account() {
  const navigate = useNavigate();
  const {isSignedIn, isLoaded} = useUser();
  const setupUserFetcher = useFetcher({ key: 'setupUser' })
  const { serialisedUser, isAdmin, tickets, userType, userId } = useLoaderData() || {};
  const [userTypeLocal, setUserTypeLocal] = useState('customer')
  const handleUserSetup = useCallback((e) => {
    e.preventDefault()
    setupUserFetcher.submit({
      actionType: 'setupUser',
      userType: userTypeLocal,
      email: serialisedUser.emailAddresses?.find(email => email?.id === serialisedUser.primaryEmailAddressId)?.emailAddress,
    }, { method: 'post', action: '/account' })
  }
    , [setupUserFetcher, serialisedUser, userTypeLocal])
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      return navigate('/sign-in')
    }
  }, [isLoaded, isSignedIn])

  if (userType === 'new' || !userType) return <div style={{
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  }} >
    <Form onSubmit={handleUserSetup} >
      <p>It looks like you are a new user. Please setup your account</p>
      <Select
        onChange={setUserTypeLocal}
        name="userType"
        label="User Type"
        value={userTypeLocal}
        options={[
          { label: 'Admin', value: 'admin' },
          { label: 'Customer', value: 'customer' },
        ]} />
      <Button submit>Setup Account</Button>
    </Form>
  </div>
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
                  <p>You are signed in as {isAdmin ? 'Admin' : 'Customer'}</p>

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
  console.log('user id is', userId)
  if (!userId) {
    return redirect('/sign-in')
  }

  // Initialize clerkClient and perform an operation
  const user = await createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }).users.getUser(
    userId,
  )
  const primaryEmail = user?.emailAddresses?.find(email => email?.id === user?.primaryEmailAddressId)?.emailAddress
  let userType = 'new'
  let isAdmin = false
  const userTypeRes = await getUserTypeByEmail(primaryEmail)
  if (userTypeRes.success) {
    userType = userTypeRes.type
    isAdmin = userType === 'admin'
  }
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

  return { serialisedUser: user, isAdmin, tickets, userType, userId };
}


export const action = async ({ request }) => {
  try {
    const formData = await request.formData();
    const actionType = formData.get('actionType');
    switch (actionType) {
      case 'setupUser': {
        const userType = String(formData.get('userType'));
        const email = String(formData.get('email'));
        const setupRes = await updateUserType(email, userType)
        if (setupRes.success) {
          return redirect('/account')
        }
        return redirect('/sign-in')
      }
    }
  } catch (error) {
    return { error }

  }
}


