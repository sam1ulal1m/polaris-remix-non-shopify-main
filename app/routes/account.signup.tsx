// This is the sign up page. It allows users to create an account.
import { redirect, useFetcher } from '@remix-run/react';
import { Button, Card, Form, FormLayout, Page, Text, TextField } from '@shopify/polaris';
import { useState } from 'react';
import AppFrame from '~/components/AppFrame';
import { createUser } from '~/server/controllers/UserController';
export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUpFetcher = useFetcher({key: 'signup'});

  const handleSubmit = () => {


    signUpFetcher.submit(
      { email, password },
      {
        method: "post",
        action: "/account/signup",
      }
    );
  };

  return (
    <AppFrame>
      <Page title="Sign Up">
        <Card>
          <Form onSubmit={handleSubmit}>
            <FormLayout>
              <Text as='p' >Create an account</Text>
              <TextField
                value={email}
                label="Email"
                onChange={setEmail}
                autoComplete="off"
              />
              <TextField
                value={password}
                type="password"
                label="Password"
                onChange={setPassword}
                autoComplete="off"
              />
              <Button submit>Sign Up</Button>
            </FormLayout>
          </Form>
        </Card>
      </Page>
    </AppFrame>
  );
}




export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Invalid data" };
  }

  try {
    const userResponse = await createUser(email, password);
    if (userResponse.success) {
      return redirect("/account/login");
    } else {
      throw new Error(JSON.stringify(userResponse));
    }

  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Error creating user" };
  }
};


