import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRoots, getRoot, createRoot, updateRoot, deleteRoot } from '../api/roots'
import type { Root } from '../types/root'

export function useRoots(search?: string) {
  return useQuery({
    queryKey: ['roots', search ?? ''],
    queryFn: () => getRoots(search),
  })
}

export function useRoot(id: string | null) {
  return useQuery({
    queryKey: ['root', id],
    queryFn: () => getRoot(id!),
    enabled: !!id,
  })
}

export function useCreateRoot() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Root, '_id'>) => createRoot(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roots'] }),
  })
}

export function useUpdateRoot() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Root> }) => updateRoot(id, data),
    onSuccess: (_result, { id }) => {
      qc.invalidateQueries({ queryKey: ['roots'] })
      qc.invalidateQueries({ queryKey: ['root', id] })
    },
  })
}

export function useDeleteRoot() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteRoot(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roots'] }),
  })
}
