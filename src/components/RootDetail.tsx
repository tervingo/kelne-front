import { useState } from 'react'
import type { Base, BaseKey, Root } from '../types/root'
import { useRoot, useUpdateRoot, useCreateRoot } from '../hooks/useRoots'
import BaseGrid from './BaseGrid'
import BaseEditor, { baseKeyStr } from './BaseEditor'

interface Props {
  rootId: string | 'new'
  onCreated?: (id: string) => void
}

function keysMatch(a: BaseKey, b: BaseKey): boolean {
  return (
    a.degree      === b.degree &&
    a.type        === b.type   &&
    a.voice       === b.voice  &&
    a.conjugation === b.conjugation
  )
}

function upsertBase(bases: Base[], edited: Base): Base[] {
  const exists = bases.some(b => keysMatch(b, edited))
  if (exists) return bases.map(b => (keysMatch(b, edited) ? edited : b))
  return [...bases, edited]
}

// ── Loader ───────────────────────────────────────────────────────────────────

export default function RootDetail({ rootId, onCreated }: Props) {
  const isNew = rootId === 'new'
  const { data: root, isLoading } = useRoot(isNew ? null : rootId)

  if (!isNew && isLoading) {
    return <p className="text-sm text-stone-500">Cargando...</p>
  }
  if (!isNew && !root) return null

  return (
    <RootForm
      key={isNew ? 'new' : root!._id}
      root={isNew ? undefined : root}
      onCreated={onCreated}
    />
  )
}

// ── Form ─────────────────────────────────────────────────────────────────────

interface FormProps {
  root: Root | undefined
  onCreated?: (id: string) => void
}

function RootForm({ root, onCreated }: FormProps) {
  const updateRoot = useUpdateRoot()
  const createRoot = useCreateRoot()

  const [rootName, setRootName] = useState(root?.root ?? '')
  const [notes,    setNotes]    = useState(root?.notes ?? '')
  const [bases,    setBases]    = useState<Base[]>(root?.bases ?? [])
  const [selectedBaseKey, setSelectedBaseKey] = useState<BaseKey | null>(null)

  const isPending = updateRoot.isPending || createRoot.isPending

  function handleBaseSave(edited: Base) {
    if (!edited.translation.trim()) {
      setBases(prev => prev.filter(b => !keysMatch(b, edited)))
    } else {
      setBases(prev => upsertBase(prev, edited))
    }
  }

  function handleSave() {
    const payload = {
      root:  rootName.trim(),
      notes: notes.trim() || undefined,
      bases,
    }
    if (root) {
      updateRoot.mutate({ id: root._id!, data: payload })
    } else {
      createRoot.mutate(payload, {
        onSuccess: created => onCreated?.(created._id!),
      })
    }
  }

  const selectedBase = selectedBaseKey
    ? bases.find(b => keysMatch(b, selectedBaseKey))
    : undefined

  return (
    <div className="space-y-6">

      {/* ── Root header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="sm:w-36">
          <label className="block text-xs text-stone-500 mb-1">Raíz</label>
          <input
            type="text"
            value={rootName}
            onChange={e => !root && setRootName(e.target.value)}
            readOnly={!!root}
            placeholder="raíz..."
            className={`w-full px-3 py-1.5 text-sm border border-stone-700 rounded-md text-stone-100 placeholder-stone-600 focus:outline-none font-mono ${
              root
                ? 'bg-stone-900 cursor-default text-stone-300'
                : 'bg-stone-800 focus:ring-1 focus:ring-stone-500'
            }`}
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-stone-500 mb-1">Notas</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            placeholder="Notas opcionales..."
            className="w-full px-3 py-1.5 text-sm border border-stone-700 rounded-md bg-stone-800 text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-stone-500 resize-none"
          />
        </div>
        <div className="shrink-0">
          <button
            onClick={handleSave}
            disabled={isPending || !rootName.trim()}
            className="px-4 py-1.5 text-sm rounded-md bg-stone-700 hover:bg-stone-600 text-stone-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* ── Base grid ────────────────────────────────────────────────────── */}
      <BaseGrid
        bases={bases}
        selectedKey={selectedBaseKey}
        onSelect={setSelectedBaseKey}
      />

      {/* ── Base editor ──────────────────────────────────────────────────── */}
      {selectedBaseKey && (
        <BaseEditor
          key={baseKeyStr(selectedBaseKey)}
          selectedKey={selectedBaseKey}
          base={selectedBase}
          rootName={rootName}
          onSave={handleBaseSave}
        />
      )}

    </div>
  )
}
