import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFoodItemService } from './foodItem-service-provider.tsx';
import { FoodItem, CreateFoodItemInput } from '@/domain/foodItem';

export function useCreateFoodItem(input: CreateFoodItemInput) {
  const service = useFoodItemService();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createFoodItem'],
    mutationFn: () => service.createFoodItem(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listFoodItems'],
      });
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

export function useUpdateFoodItem(id: string, foodItem: FoodItem) {
  const service = useFoodItemService();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['updateFoodItem', id],
    mutationFn: () => service.updateFoodItem(id, foodItem),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listFoodItems'],
      });

      queryClient.invalidateQueries({
        queryKey: ['getFoodItemById', id],
      });
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
  });
}
