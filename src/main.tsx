import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import './i18n';
import Root from './components/root';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { LlmKeyServiceProvider } from './components/llmKey-service-provider';
// import { ParameterServiceProvider } from './components/parameter-service-provider';
// import TelegramProviderProvider from './components/telegram-provider-provider';
// import { UserIdProvider } from './components/user-id-provider';
import { LlmKeyRepositoryLocal, LlmKeyServiceImpl } from '@/domain/llmKey';

const queryClient = new QueryClient();

const llmKeyRepository = new LlmKeyRepositoryLocal();
const llmKeyService = new LlmKeyServiceImpl({ llmKeyRepository });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <BrowserRouter>
          <LlmKeyServiceProvider service={llmKeyService}>
            <Root />
          </LlmKeyServiceProvider>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
);
