import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/remix';
import { createClerkClient } from '@clerk/remix/api.server';
import { getAuth } from '@clerk/remix/ssr.server';
import { redirect } from '@remix-run/node';
import { Box, Card, Page } from '@shopify/polaris';
import { LoaderFunction, Outlet, useLoaderData } from 'react-router';
import AppFrame from '~/components/AppFrame';

export default function Index() {
 return null
}


export const loader: LoaderFunction = async (args) => {
  return redirect('/account')
}