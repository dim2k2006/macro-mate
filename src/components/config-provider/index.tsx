import React, { createContext, useContext } from 'react';
import { Config } from '../../container';

const ConfigContext = createContext<Config | null>(null);

interface ConfigProviderProps {
  config: Config;
  children: React.ReactNode;
}

const ConfigProvider: React.FC<ConfigProviderProps> = ({ config, children }) => {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
};

export function useConfig(): Config {
  const ctx = useContext(ConfigContext);

  if (!ctx) {
    throw new Error(
      'Error caught while consuming ConfigContext. Make sure you wrap the Component inside the "ConfigProvider" component.',
    );
  }

  return ctx;
}

export default ConfigProvider;
