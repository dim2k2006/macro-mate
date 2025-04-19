import { RemixBrowser } from '@remix-run/react';
import { hydrateRoot } from 'react-dom/client';

declare global {
  interface Window {
    __remixContext__: unknown;
  }
}

// Привязываем клиентский React
hydrateRoot(document, <RemixBrowser />);
