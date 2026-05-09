import { useState } from 'react'
import RootList from './components/RootList'
import BaseGrid from './components/BaseGrid'
import type { BaseKey } from './types/root'

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedBaseKey, setSelectedBaseKey] = useState<BaseKey | null>(null)

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-stone-700 bg-stone-900 flex flex-col">
        <div className="px-4 py-5 border-b border-stone-700">
          <h1 className="text-lg font-semibold tracking-tight">kelne</h1>
          <p className="text-xs text-stone-500 mt-0.5">gestor de raíces</p>
        </div>
        <RootList selectedId={selectedId} onSelect={setSelectedId} />
        <div className="p-3 border-t border-stone-700">
          <button className="w-full text-sm px-3 py-1.5 rounded-md border border-stone-600 hover:bg-stone-800 transition-colors">
            + Nueva raíz
          </button>
        </div>
      </aside>

      {/* Main panel */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {selectedId ? (
            <BaseGrid
              bases={[]}
              selectedKey={selectedBaseKey}
              onSelect={setSelectedBaseKey}
            />
          ) : (
            <p className="text-stone-500 text-sm">Selecciona una raíz para ver su detalle.</p>
          )}
        </div>
      </main>
    </div>
  )
}
