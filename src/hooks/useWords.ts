import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getWords, getWord, createWord, updateWord, deleteWord } from '../api/words'
import type { Word, WordCat } from '../types/word'

export function useWords(q?: string, cat?: WordCat, raiz?: string) {
  return useQuery({
    queryKey: ['words', q ?? '', cat ?? '', raiz ?? ''],
    queryFn:  () => getWords(q, cat, raiz),
  })
}

export function useWordSearch(q: string, cat?: WordCat) {
  return useQuery({
    queryKey: ['words', 'search', q, cat ?? ''],
    queryFn:  () => getWords(q, cat),
    enabled:  q.trim().length > 0,
  })
}

export function useWord(id: string | null) {
  return useQuery({
    queryKey: ['word', id],
    queryFn:  () => getWord(id!),
    enabled:  !!id,
  })
}

export function useCreateWord() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Word, '_id'>) => createWord(data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['words'] }),
  })
}

export function useUpdateWord() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Word> }) => updateWord(id, data),
    onSuccess: (_r, { id }) => {
      qc.invalidateQueries({ queryKey: ['words'] })
      qc.invalidateQueries({ queryKey: ['word', id] })
    },
  })
}

export function useDeleteWord() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteWord(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['words'] }),
  })
}
