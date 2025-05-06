import React, { createContext, useContext } from 'react';
import { SettingsService } from '@/domain/settings';

const SettingsServiceContext = createContext<SettingsService | null>(null);

interface SettingsServiceProviderProps {
  service: SettingsService;
  children: React.ReactNode;
}

const SettingsServiceProvider: React.FC<SettingsServiceProviderProps> = ({ service, children }) => {
  return <SettingsServiceContext.Provider value={service}>{children}</SettingsServiceContext.Provider>;
};

export function useSettingsService(): SettingsService {
  const ctx = useContext(SettingsServiceContext);

  if (!ctx) {
    throw new Error(
      'Error caught while consuming SettingsServiceContext. Make sure you wrap the Component inside the "SettingsServiceProvider" component.',
    );
  }

  return ctx;
}

export default SettingsServiceProvider;
