import React, { createContext, useContext } from 'react';
import { LlmKeyService } from '@/domain/llmKey';

const LlmKeyServiceContext = createContext<LlmKeyService | null>(null);

interface LlmKeyServiceProviderProps {
  service: LlmKeyService;
  children: React.ReactNode;
}

const LlmKeyServiceProvider: React.FC<LlmKeyServiceProviderProps> = ({ service, children }) => {
  return <LlmKeyServiceContext.Provider value={service}>{children}</LlmKeyServiceContext.Provider>;
};

export function useLlmKeyService(): LlmKeyService {
  const ctx = useContext(LlmKeyServiceContext);

  if (!ctx) {
    throw new Error(
      'Error caught while consuming LlmKeyServiceContext. Make sure you wrap the Component inside the "LlmKeyServiceProvider" component.',
    );
  }

  return ctx;
}

export default LlmKeyServiceProvider;
