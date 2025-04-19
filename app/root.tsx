import type { MetaFunction, LinksFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import tailwindStylesheetUrl from './styles/tailwind.css';

export const meta: MetaFunction = () => [
  { charset: 'utf-8' },
  { title: 'MacroMate' },
  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
];

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: tailwindStylesheetUrl }];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="p-4 bg-gray-50">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
