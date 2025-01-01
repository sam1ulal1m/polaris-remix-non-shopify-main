import { Card, Page, FormLayout, TextField, Button } from '@shopify/polaris';
import AppFrame from '~/components/AppFrame';
import { useState } from "react"
import { Form } from '@remix-run/react';

export default function Settings() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  return (
    <AppFrame>
      <Page title="Login">
        <Card>
          <FormLayout>
            <Form method='POST' action='/account/login' >
              <TextField value={email} label="Email" onChange={setEmail} autoComplete="off" />
              <TextField
                value={password}
                type="password"
                label="Password"
                onChange={setPassword}
                autoComplete="email"
              />
              <Button submit>Submit</Button>
            </Form>
          </FormLayout>
        </Card>
      </Page>
    </AppFrame>
  );
}
