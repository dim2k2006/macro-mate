import React, { createContext, useContext } from 'react';
import { MealService } from '@/domain/meal';

const MealServiceContext = createContext<MealService | null>(null);

interface MealServiceProviderProps {
  service: MealService;
  children: React.ReactNode;
}

const MealServiceProvider: React.FC<MealServiceProviderProps> = ({ service, children }) => {
  return <MealServiceContext.Provider value={service}>{children}</MealServiceContext.Provider>;
};

export function useMealService(): MealService {
  const ctx = useContext(MealServiceContext);

  if (!ctx) {
    throw new Error(
      'Error caught while consuming MealServiceContext. Make sure you wrap the Component inside the "MealServiceProvider" component.',
    );
  }

  return ctx;
}

export default MealServiceProvider;
