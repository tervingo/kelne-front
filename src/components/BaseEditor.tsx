import { useState } from 'react'
import type { Base, BaseKey } from '../types/root'
import DerivedWordTable from './DerivedWordTable'

interface Props {
  selectedKey: BaseKey
  base:        Base | undefined
  rootId?:     string
  onSave:      (base: Base) => void
}

// Render the parent with key={baseKeyStr(selectedKey)} to reset state on key change.
export function baseKeyStr(key: BaseKey): string {
  return `${key.degree}-${key.type}-${key.voice ?? ''}-${key.conjugation ?? ''}`
}

function keyLabel(key: BaseKey): string {
  const parts: string[] = [key.degree, key.type]
  if (key.voice) parts.push(key.voice)
  if (key.conjugation) parts.push(key.conjugation)
  return parts.join(' · ')
}

export default function BaseEditor({ selectedKey, base, rootId, onSave }: Props) {
  const [translation, setTranslation] = useState(base?.translation ?? '')
  const [words, setWords] = useState(base?.derivedWords ?? [])

  function handleSave() {
    onSave({
      degree:      selectedKey.degree,
      type:        selectedKey.type,
      voice:       selectedKey.voice,
      conjugation: selectedKey.conjugation,
      translation,
      derivedWords: words,
    })
  }

  return (
    <div className="space-y-4 border-t border-stone-700 pt-5">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">Base</span>
        <span className="text-sm text-stone-300">{keyLabel(selectedKey)}</span>
      </div>

      <div>
        <label className="block text-xs text-stone-500 mb-1">Traducción</label>
        <input
          type="text"
          value={translation}
          onChange={e => setTranslation(e.target.value)}
          placeholder="Traducción de la base..."
          autoFocus
          className="w-full px-3 py-1.5 text-sm border border-stone-700 rounded-md bg-stone-800 text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-stone-500"
        />
      </div>

      <DerivedWordTable words={words} baseKey={selectedKey} rootId={rootId} onChange={setWords} />

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-1.5 text-sm rounded-md bg-stone-700 hover:bg-stone-600 text-stone-100 transition-colors"
        >
          Guardar
        </button>
      </div>
    </div>
  )
}
