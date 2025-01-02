// This is the login page for the account section of the app
import { Card, Page, FormLayout, TextField, Button, Text, Form } from '@shopify/polaris';
import AppFrame from '~/components/AppFrame';
import { useState } from "react"
import { redirect, useFetcher } from '@remix-run/react';
import { authenticateUser } from '~/server/controllers/UserController';

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const loginFetcher = useFetcher({ key: 'login' })
  const handleSubmit = () => {
    loginFetcher.submit(
      { email, password },
      {
        method: "post",
        action: "/account/login",
      }
    );
  }
  return (
    <AppFrame>
      <Page title="Login">
        <Card>
          <Form onSubmit={handleSubmit}>
            <FormLayout>
              <Text as='p' >Log in to your account</Text>
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
              <Button submit>Login</Button>
            </FormLayout>
          </Form>
        </Card>
      </Page>
    </AppFrame>
  );
}

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    const authResponse = await authenticateUser(email, password);

    if (authResponse.success) {
      // store the token in a cookie
      const token = authResponse.token;
      const cookie = `token=${token}; Path=/; HttpOnly; SameSite=Strict`;
      const headers = {
        "Set-Cookie": cookie,
        "Location": "/account/",
      };
      return new Response(null, { headers, status: 302 });
    } else {
      return { error: authResponse.error || "Login failed" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An error occurred while logging in" };
  }
}