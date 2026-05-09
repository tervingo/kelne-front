import { useState } from 'react'
import { useWords } from '../hooks/useWords'
import { WORD_CAT_LABELS, wordBadge } from '../types/word'
import type { WordCat } from '../types/word'

interface Props {
  selectedId: string | null
  onSelect:   (id: string) => void
}

const CATS: WordCat[] = ['N', 'V', 'PN', 'DT', 'AV', 'AF', 'CJ', 'PT']

export default function WordList({ selectedId, onSelect }: Props) {
  const [search,  setSearch]  = useState('')
  const [catFilter, setCat]   = useState<WordCat | undefined>()

  const { data: words = [], isLoading, isError } = useWords(
    search || undefined,
    catFilter,
  )

  return (
    <>
      <div className="p-3 space-y-2">
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar kelne o trad..."
          className="w-full px-3 py-1.5 text-sm border border-stone-700 rounded-md bg-stone-800 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
        />
        <select
          value={catFilter ?? ''}
          onChange={e => setCat((e.target.value as WordCat) || undefined)}
          className="w-full px-2 py-1 text-xs border border-stone-700 rounded-md bg-stone-800 text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-500"
        >
          <option value="">Todas las categorías</option>
          {CATS.map(c => (
            <option key={c} value={c}>{c} — {WORD_CAT_LABELS[c]}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {isLoading && <p className="text-xs text-stone-500 px-2 py-4">Cargando...</p>}
        {isError   && <p className="text-xs text-red-400  px-2 py-4">Error al cargar palabras.</p>}
        {!isLoading && words.length === 0 && (
          <p className="text-xs text-stone-500 px-2 py-4">
            {search || catFilter ? 'Sin resultados.' : 'Sin palabras todavía.'}
          </p>
        )}
        {words.map(word => (
          <button
            key={word._id}
            onClick={() => onSelect(word._id!)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              selectedId === word._id
                ? 'bg-stone-700 font-medium text-stone-100'
                : 'hover:bg-stone-800 text-stone-300'
            }`}
          >
            <span className="text-sm font-mono block">{word.kelne}</span>
            <span className="text-xs text-stone-500 flex items-center gap-1.5">
              <span>{word.trad}</span>
              <span className="text-stone-700">·</span>
              <span className="text-stone-600">{wordBadge(word)}</span>
            </span>
          </button>
        ))}
      </div>
    </>
  )
}
