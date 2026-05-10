import { useState } from 'react'
import RootList   from './components/RootList'
import RootDetail from './components/RootDetail'
import WordList   from './components/WordList'
import WordEditor from './components/WordEditor'

type Section = 'roots' | 'words'

export default function App() {
  const [section,        setSection]        = useState<Section>('roots')
  const [selectedRootId, setSelectedRootId] = useState<string | null>(null)
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null)

  function handleRootCreated(id: string) { setSelectedRootId(id) }
  function handleWordCreated(id: string) { setSelectedWordId(id) }

  const TAB = (active: boolean) =>
    `flex-1 py-2 text-xs font-medium transition-colors ${
      active
        ? 'text-stone-100 border-b-2 border-stone-400'
        : 'text-stone-500 hover:text-stone-300'
    }`

  return (
    <div className="flex h-screen">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-64 shrink-0 border-r border-stone-700 bg-stone-900 flex flex-col">

        {/* Header */}
        <div className="px-4 py-4 border-b border-stone-700">
          <h1 className="text-2xl font-semibold tracking-tight text-orange-500">Kelnena</h1>
          <p className="text-lg text-stone-500 mt-0.5 text-orange-300">Taulnen seiksokyndosivas</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-700 shrink-0">
          <button className={TAB(section === 'roots')} onClick={() => setSection('roots')}>
            Raíces
          </button>
          <button className={TAB(section === 'words')} onClick={() => setSection('words')}>
            Palabras
          </button>
        </div>

        {/* List */}
        {section === 'roots'
          ? <RootList selectedId={selectedRootId} onSelect={setSelectedRootId} />
          : <WordList selectedId={selectedWordId} onSelect={setSelectedWordId} />
        }

        {/* New button */}
        <div className="p-3 border-t border-stone-700 shrink-0">
          {section === 'roots' ? (
            <button
              onClick={() => setSelectedRootId('new')}
              className="w-full text-sm px-3 py-1.5 rounded-md border border-stone-600 hover:bg-stone-800 transition-colors"
            >
              + Nueva raíz
            </button>
          ) : (
            <button
              onClick={() => setSelectedWordId('new')}
              className="w-full text-sm px-3 py-1.5 rounded-md border border-stone-600 hover:bg-stone-800 transition-colors"
            >
              + Nueva palabra
            </button>
          )}
        </div>

      </aside>

      {/* ── Main panel ───────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-8">
        <div className="max-w-4xl mx-auto">

          {section === 'roots' && (
            selectedRootId
              ? <RootDetail key={selectedRootId} rootId={selectedRootId} onCreated={handleRootCreated} />
              : <p className="text-stone-500 text-sm mt-2">Selecciona una raíz o crea una nueva.</p>
          )}

          {section === 'words' && (
            selectedWordId
              ? <WordEditor key={selectedWordId} wordId={selectedWordId} onCreated={handleWordCreated} />
              : <p className="text-stone-500 text-sm mt-2">Selecciona una palabra o crea una nueva.</p>
          )}

        </div>
      </main>

    </div>
  )
}
