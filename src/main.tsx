import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/charts/styles.css';
import './i18n';
import Root from './components/root';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { SettingsRepositoryLocal, SettingsServiceImpl } from '@/domain/settings';
import { SettingsServiceProvider } from '@/components/settings-service-provider';

const queryClient = new QueryClient();

const settingsRepository = new SettingsRepositoryLocal();
const settingsService = new SettingsServiceImpl({ settingsRepository });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <BrowserRouter>
          <SettingsServiceProvider service={settingsService}>
            <Root />
          </SettingsServiceProvider>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
);
