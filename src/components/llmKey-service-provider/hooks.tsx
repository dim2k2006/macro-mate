import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLlmKeyService } from './llmKey-service-provider.tsx';
import { LlmKey } from '@/domain/llmKey';

export function useCreateLlmKey() {
  const llmKeyService = useLlmKeyService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (key: string) => llmKeyService.createLlmKey(key),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['llmKey'],
      });
    },
  });
}

export function useGetLlmKey() {
  const llmKeyService = useLlmKeyService();

  return useQuery({
    queryKey: ['llmKey'],
    queryFn: async () => llmKeyService.getLlmKey(),
    refetchOnWindowFocus: false,
  });
}

export function useUpdateLlmKey() {
  const llmKeyService = useLlmKeyService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (key: LlmKey) => llmKeyService.updateLlmKey(key),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['llmKey'],
      });
    },
  });
}

export function useDeleteLlmKey() {
  const llmKeyService = useLlmKeyService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => llmKeyService.deleteLlmKey(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['llmKey'],
      });
    },
  });
}
