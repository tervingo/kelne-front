import type { Root, RootListItem, Base } from '../types/root'

const BASE_URL = '/api/roots'

function serializeBase(b: Base) {
  return {
    degree:      b.degree,
    type:        b.type,
    voice:       b.voice,
    conjugation: b.conjugation,
    translation: b.translation,
    derivedWords: b.derivedWords.map(w => ({ kelne: w.kelne, cat: w.cat })),
  }
}

function serializePayload(data: Partial<Omit<Root, '_id'>>) {
  if (!data.bases) return data
  return { ...data, bases: data.bases.map(serializeBase) }
}

export async function getRoots(search?: string): Promise<RootListItem[]> {
  const url = search ? `${BASE_URL}?q=${encodeURIComponent(search)}` : BASE_URL
  const res = await fetch(url)
  if (!res.ok) throw new Error('Error cargando raíces')
  return res.json()
}

export async function getRoot(id: string): Promise<Root> {
  const res = await fetch(`${BASE_URL}/${id}`)
  if (!res.ok) throw new Error('Raíz no encontrada')
  return res.json()
}

export async function createRoot(data: Omit<Root, '_id'>): Promise<Root> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serializePayload(data)),
  })
  if (!res.ok) throw new Error('Error creando raíz')
  return res.json()
}

export async function updateRoot(id: string, data: Partial<Root>): Promise<Root> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serializePayload(data)),
  })
  if (!res.ok) throw new Error('Error actualizando raíz')
  return res.json()
}

export async function deleteRoot(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error eliminando raíz')
}
