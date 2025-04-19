import React, { createContext, useContext } from 'react';
import { FoodItemService } from '@/domain/foodItem';

const FoodItemServiceContext = createContext<FoodItemService | null>(null);

interface ParameterServiceProviderProps {
  service: FoodItemService;
  children: React.ReactNode;
}

const FoodItemServiceProvider: React.FC<ParameterServiceProviderProps> = ({ service, children }) => {
  return <FoodItemServiceContext.Provider value={service}>{children}</FoodItemServiceContext.Provider>;
};

export function useFoodItemService(): FoodItemService {
  const ctx = useContext(FoodItemServiceContext);

  if (!ctx) {
    throw new Error(
      'Error caught while consuming FoodItemServiceContext. Make sure you wrap the Component inside the "FoodItemServiceProvider" component.',
    );
  }

  return ctx;
}

export default FoodItemServiceProvider;
