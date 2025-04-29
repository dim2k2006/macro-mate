import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFoodItemService } from './foodItem-service-provider.tsx';
import { FoodItem, CreateFoodItemInput } from '@/domain/foodItem';

export function useCreateFoodItem() {
  const service = useFoodItemService();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createFoodItem'],
    mutationFn: (input: CreateFoodItemInput) => service.createFoodItem(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listFoodItems'],
      });
    },
    onError: (error: Error) => {
      console.error('Error creating food item:', error);
    },
  });
}

export function useGetFoodItemById(id: string) {
  const service = useFoodItemService();

  return useQuery({
    queryKey: ['getFoodItemById', id],
    queryFn: () => service.getFoodItemById(id),
  });
}

export function useListFoodItems() {
  const service = useFoodItemService();

  return useQuery({
    queryKey: ['listFoodItems'],
    queryFn: () => service.listFoodItems(),
  });
}

export function useUpdateFoodItem(id: string) {
  const service = useFoodItemService();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['updateFoodItem', id],
    mutationFn: (foodItem: FoodItem) => service.updateFoodItem(id, foodItem),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listFoodItems'],
      });

      queryClient.invalidateQueries({
        queryKey: ['getFoodItemById', id],
      });
    },
    onError: (error: Error) => {
      console.error('Error updating food item:', error);
    },
  });
}

export function useUpsertFoodItem(id: string) {
  const service = useFoodItemService();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['upsertFoodItem', id],
    mutationFn: (foodItem: FoodItem) => service.upsertFoodItem(id, foodItem),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listFoodItems'],
      });

      queryClient.invalidateQueries({
        queryKey: ['getFoodItemById', id],
      });
    },
    onError: (error: Error) => {
      console.error('Error upserting food item:', error);
    },
  });
}

export function useDeleteFoodItem(id: string) {
  const service = useFoodItemService();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['deleteFoodItem', id],
    mutationFn: () => service.deleteFoodItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listFoodItems'],
      });

      queryClient.invalidateQueries({
        queryKey: ['getFoodItemById', id],
      });
    },
    onError: (error: Error) => {
      console.error('Error deleting food item:', error);
    },
  });
}

export function useCalculateMacros(id: string) {
  const service = useFoodItemService();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['calculateMacros', id],
    mutationFn: () => service.calculateMacros(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listFoodItems'],
      });

      queryClient.invalidateQueries({
        queryKey: ['getFoodItemById', id],
      });
    },
    onError: (error: Error) => {
      console.error('Error calculating macros:', error);
    },
  });
}

export function useParseMacros(id: string) {
  const service = useFoodItemService();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['parseMacros', id],
    mutationFn: () => service.parseMacros(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listFoodItems'],
      });

      queryClient.invalidateQueries({
        queryKey: ['getFoodItemById', id],
      });
    },
    onError: (error: Error) => {
      console.error('Error parsing macros:', error);
    },
  });
}
