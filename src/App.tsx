import { useState } from 'react'
import RootList from './components/RootList'
import RootDetail from './components/RootDetail'

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  function handleCreated(id: string) {
    setSelectedId(id)
  }

  return (
    <div className="flex h-screen">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-64 shrink-0 border-r border-stone-700 bg-stone-900 flex flex-col">
        <div className="px-4 py-5 border-b border-stone-700">
          <h1 className="text-lg font-semibold tracking-tight">kelne</h1>
          <p className="text-xs text-stone-500 mt-0.5">gestor de raíces</p>
        </div>

        <RootList selectedId={selectedId} onSelect={setSelectedId} />

        <div className="p-3 border-t border-stone-700">
          <button
            onClick={() => setSelectedId('new')}
            className="w-full text-sm px-3 py-1.5 rounded-md border border-stone-600 hover:bg-stone-800 transition-colors"
          >
            + Nueva raíz
          </button>
        </div>
      </aside>

      {/* ── Main panel ───────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-8">
        <div className="max-w-4xl mx-auto">
          {selectedId ? (
            <RootDetail
              key={selectedId}
              rootId={selectedId}
              onCreated={handleCreated}
            />
          ) : (
            <p className="text-stone-500 text-sm mt-2">
              Selecciona una raíz o crea una nueva.
            </p>
          )}
        </div>
      </main>

    </div>
  )
}
