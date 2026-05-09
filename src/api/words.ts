import type { Word, WordCat } from '../types/word'

const BASE_URL = '/api/words'

export async function getWords(q?: string, cat?: WordCat, raiz?: string): Promise<Word[]> {
  const params = new URLSearchParams()
  if (q)    params.set('q',    q)
  if (cat)  params.set('cat',  cat)
  if (raiz) params.set('raiz', raiz)
  const qs = params.toString()
  const res = await fetch(qs ? `${BASE_URL}?${qs}` : BASE_URL)
  if (!res.ok) throw new Error('Error cargando palabras')
  return res.json()
}

export async function getWord(id: string): Promise<Word> {
  const res = await fetch(`${BASE_URL}/${id}`)
  if (!res.ok) throw new Error('Palabra no encontrada')
  return res.json()
}

export async function createWord(data: Omit<Word, '_id'>): Promise<Word> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error creando palabra')
  return res.json()
}

export async function updateWord(id: string, data: Partial<Word>): Promise<Word> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error actualizando palabra')
  return res.json()
}

export async function deleteWord(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error eliminando palabra')
}
