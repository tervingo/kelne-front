import { useState } from 'react'
import { useRoots } from '../hooks/useRoots'

interface Props {
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function RootList({ selectedId, onSelect }: Props) {
  const [search, setSearch] = useState('')
  const { data: roots, isLoading, isError } = useRoots(search || undefined)

  return (
    <>
      <div className="p-3">
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar raíz o traducción..."
          className="w-full px-3 py-1.5 text-sm border border-stone-700 rounded-md bg-stone-800 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {isLoading && (
          <p className="text-xs text-stone-500 px-2 py-4">Cargando...</p>
        )}
        {isError && (
          <p className="text-xs text-red-400 px-2 py-4">Error al cargar raíces.</p>
        )}
        {roots && roots.length === 0 && (
          <p className="text-xs text-stone-500 px-2 py-4">
            {search ? 'Sin resultados.' : 'Sin raíces todavía.'}
          </p>
        )}
        {roots && roots.map(root => (
          <button
            key={root._id}
            onClick={() => onSelect(root._id!)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              selectedId === root._id
                ? 'bg-stone-700 font-medium text-stone-100'
                : 'hover:bg-stone-800 text-stone-300'
            }`}
          >
            {root.root}
          </button>
        ))}
      </div>
    </>
  )
}
