import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createItem, getItems, updateItem, deleteItem } from '../services/item';
import { Item } from '../types/item';

export function useItems(userId: string) {
  return useQuery<Item[]>({
    queryKey: ['items', userId],
    queryFn: () => getItems(userId),
    enabled: !!userId,
  });
}

export function useCreateItem(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: Omit<Item, 'id'>) => createItem(userId, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', userId] });
    },
  });
}

export function useUpdateItem(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Item> }) =>
      updateItem(userId, id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', userId] });
    },
  });
}

export function useDeleteItem(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteItem(userId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', userId] });
    },
  });
}
