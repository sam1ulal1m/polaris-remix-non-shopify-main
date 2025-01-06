import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { AppProvider } from '@shopify/polaris';
import type { LinkLikeComponentProps } from '@shopify/polaris/build/ts/src/utilities/link/types';
import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import styles from '@shopify/polaris/build/esm/styles.css';
import variables from '~/styles/variables.css';
import { rootAuthLoader } from '@clerk/remix/ssr.server'
import { ClerkApp } from '@clerk/remix'

export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { title: 'New Remix App' },
    { viewport: 'width=device-width,initial-scale=1' },
  ];
};

export function links() {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'stylesheet', href: variables },
  ];
}

/** @type {any} */
function LinkWrapper(props: LinkLikeComponentProps) {
  return (
    // TODO: fix type conflix with LegacyRef and Ref between Remix and Polaris
    <Link to={props.url ?? props.to} ref={props.ref} {...props}>
      {props.children}
    </Link>
  );
}

export  function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <AppProvider
          i18n={{
            Polaris: {
              ResourceList: {
                sortingLabel: 'Sort by',
                defaultItemSingular: 'item',
                defaultItemPlural: 'items',
                showing: 'Showing {itemsCount} {resource}',
                Item: {
                  viewItem: 'View details for {itemName}',
                },
              },
              Common: {
                checkbox: 'checkbox',
              },
            },
          }}
          linkComponent={LinkWrapper}
        >
          <Outlet />
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
export default ClerkApp(App)

export const loader: LoaderFunction = (args) => rootAuthLoader(args)
