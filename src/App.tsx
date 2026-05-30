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
  const [exporting,      setExporting]      = useState(false)

  function handleRootCreated(id: string) { setSelectedRootId(id) }
  function handleWordCreated(id: string) { setSelectedWordId(id) }

  async function exportDictionary() {
    setExporting(true)
    try {
      const res = await fetch('/api/dictionary/pdf')
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const dbx = res.headers.get('X-Dropbox-Status') ?? 'skipped'
      if (dbx === 'ok') {
        alert('Diccionario generado y subido a Dropbox.')
      } else if (dbx === 'skipped') {
        alert('Dropbox no configurado.')
      } else {
        alert(`Error Dropbox: ${dbx}`)
      }
    } finally {
      setExporting(false)
    }
  }

  const TAB = (active: boolean) =>
    `flex-1 py-2 text-xs font-medium transition-colors ${
      active
        ? 'text-stone-100 border-b-2 border-stone-400'
        : 'text-stone-500 hover:text-stone-300'
    }`

  return (
    <div className="flex h-screen">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-96 shrink-0 border-r border-stone-700 bg-stone-900 flex flex-col">

        {/* Header */}
        <div className="px-4 py-4 border-b border-stone-700">
          <h1 className="text-2xl font-semibold tracking-tight text-orange-500">Kelne</h1>
          <p className="text-lg mt-0.5 text-orange-400">Taulnen seiksokyndosivas</p>
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

        {/* New button + export */}
        <div className="p-3 border-t border-stone-700 shrink-0 space-y-2">
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
          <button
            onClick={exportDictionary}
            disabled={exporting}
            className="w-full text-xs px-3 py-1.5 rounded-md border border-stone-700 text-stone-500 hover:text-stone-300 hover:border-stone-600 transition-colors disabled:opacity-40"
          >
            {exporting ? 'Generando PDF…' : '↓ Exportar diccionario'}
          </button>
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
              ? <WordEditor key={selectedWordId} wordId={selectedWordId} onCreated={handleWordCreated} onDeleted={() => setSelectedWordId(null)} />
              : <p className="text-stone-500 text-sm mt-2">Selecciona una palabra o crea una nueva.</p>
          )}

        </div>
      </main>

    </div>
  )
}
