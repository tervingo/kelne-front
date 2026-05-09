import type { Word } from './word'

export type Degree = 'normal' | 'fuerte' | 'largo'
export type WordType = 'nombre' | 'verbo'
export type Voice = 'activa' | 'media'
export type Conjugation = 'agentiva' | 'receptiva'

export interface Base {
  degree: Degree
  type: WordType
  voice?: Voice
  conjugation?: Conjugation
  translation: string
  derivedWords: Word[]   // populated Word objects from API
}

export interface Root {
  _id?: string
  root: string
  notes?: string
  bases: Base[]
}

// Returned by GET /api/roots (list) — no bases detail
export interface RootListItem {
  _id: string
  root: string
  notes?: string
}

// Clave única para identificar una base dentro de una raíz
export type BaseKey = {
  degree: Degree
  type: WordType
  voice?: Voice
  conjugation?: Conjugation
}

// Las 15 posibles combinaciones de base, en orden de presentación en la tabla
export const ALL_BASE_KEYS: BaseKey[] = [
  // Grado normal
  { degree: 'normal', type: 'nombre' },
  { degree: 'normal', type: 'verbo', voice: 'activa',  conjugation: 'agentiva' },
  { degree: 'normal', type: 'verbo', voice: 'activa',  conjugation: 'receptiva' },
  { degree: 'normal', type: 'verbo', voice: 'media',   conjugation: 'agentiva' },
  { degree: 'normal', type: 'verbo', voice: 'media',   conjugation: 'receptiva' },
  // Grado fuerte
  { degree: 'fuerte', type: 'nombre' },
  { degree: 'fuerte', type: 'verbo', voice: 'activa',  conjugation: 'agentiva' },
  { degree: 'fuerte', type: 'verbo', voice: 'activa',  conjugation: 'receptiva' },
  { degree: 'fuerte', type: 'verbo', voice: 'media',   conjugation: 'agentiva' },
  { degree: 'fuerte', type: 'verbo', voice: 'media',   conjugation: 'receptiva' },
  // Grado largo
  { degree: 'largo',  type: 'nombre' },
  { degree: 'largo',  type: 'verbo', voice: 'activa',  conjugation: 'agentiva' },
  { degree: 'largo',  type: 'verbo', voice: 'activa',  conjugation: 'receptiva' },
  { degree: 'largo',  type: 'verbo', voice: 'media',   conjugation: 'agentiva' },
  { degree: 'largo',  type: 'verbo', voice: 'media',   conjugation: 'receptiva' },
]
