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

export function useUpdateFoodItem() {
  const service = useFoodItemService();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, foodItem }: { id: string; foodItem: FoodItem }) => service.updateFoodItem(id, foodItem),
    onSuccess: (foodItem) => {
      queryClient.invalidateQueries({
        queryKey: ['listFoodItems'],
      });

      queryClient.invalidateQueries({
        queryKey: ['getFoodItemById', foodItem.id],
      });
    },
    onError: (error: Error) => {
      console.error('Error updating food item:', error);
    },
  });
}

export function useUpsertFoodItem() {
  const service = useFoodItemService();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, foodItem }: { id: string; foodItem: FoodItem }) => service.upsertFoodItem(id, foodItem),
    onSuccess: (foodItem) => {
      queryClient.invalidateQueries({
        queryKey: ['listFoodItems'],
      });

      queryClient.invalidateQueries({
        queryKey: ['getFoodItemById', foodItem.id],
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

export function useCalculateMacros(id: string, options?: UseCalculateMacrosOptions) {
  const service = useFoodItemService();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['calculateMacros', id],
    mutationFn: () => service.calculateMacros(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['listFoodItems'],
      });

      queryClient.invalidateQueries({
        queryKey: ['getFoodItemById', id],
      });

      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: Error) => {
      console.error('Error calculating macros:', error);

      if (options?.onError) {
        options.onError(error);
      }
    },
  });
}

type UseCalculateMacrosOptions = {
  onSuccess?: (data: FoodItem) => void;
  onError?: (error: Error) => void;
};

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

export function useRecognizeMacrosFromImage() {
  const service = useFoodItemService();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['recognizeMacrosFromImage'],
    mutationFn: (input: File[]) => service.recognizeMacrosFromImage(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listFoodItems'],
      });
    },
    onError: (error: Error) => {
      console.error('Error recognizing macros from image:', error);
    },
  });
}
