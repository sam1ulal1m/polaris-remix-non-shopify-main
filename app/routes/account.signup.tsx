import { useFetcher } from '@remix-run/react';
import { Button, Card, FormLayout, Page, TextField, Form } from '@shopify/polaris';
import { useState } from 'react';
import AppFrame from '~/components/AppFrame';
import bcrypt from 'bcryptjs';
import { prisma } from '~/db.server';  // Assuming you have a Prisma client instance
export default function Settings() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUpFetcher = useFetcher();

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

  if (typeof email !== 'string' || typeof password !== 'string') {
    return { error: 'Invalid data' };
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    console.log("User created:", newUser);

    return { success: true, user: newUser };  // Return success and user data
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: 'Error creating user' };
  }
};

