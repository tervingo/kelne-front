import { useState } from 'react'
import type { Word, WordCat } from '../types/word'
import type { BaseKey } from '../types/root'
import { NOMBRE_CLASES, wordBadge } from '../types/word'
import { useWordSearch, useCreateWord } from '../hooks/useWords'

interface Props {
  words:    Word[]
  baseKey:  BaseKey
  rootId?:  string
  onChange: (words: Word[]) => void
}

function inferFromBase(k: BaseKey): {
  cat: WordCat; tipo: string; voz?: 'A' | 'M'; alin?: 'AGT' | 'RCT'
} {
  return {
    cat:  k.type === 'nombre' ? 'N' : 'V',
    tipo: k.degree === 'largo' ? 'DL' : k.degree === 'fuerte' ? 'DF' : 'DN',
    voz:  k.voice === 'activa' ? 'A' : k.voice === 'media' ? 'M' : undefined,
    alin: k.conjugation === 'agentiva' ? 'AGT' : k.conjugation === 'receptiva' ? 'RCT' : undefined,
  }
}

const TD = 'border border-stone-700 px-2 py-1.5 bg-stone-900 text-stone-200 text-xs'

export default function DerivedWordTable({ words, baseKey, rootId, onChange }: Props) {
  const [search,      setSearch]      = useState('')
  const [showDropdown, setDropdown]   = useState(false)
  const [showForm,    setShowForm]    = useState(false)
  const [form, setForm] = useState({ kelne: '', trad: '', clase: '' })
  const [formCat, setFormCat] = useState<WordCat>('N')

  const inferred = inferFromBase(baseKey)
  // When base is verbal, don't filter by cat — both N and V can be derived from it
  const searchCat = baseKey.type === 'nombre' ? inferred.cat : undefined
  const { data: results = [] } = useWordSearch(search, searchCat)
  const createWord = useCreateWord()

  const addedIds = new Set(words.map(w => w._id).filter(Boolean))
  const suggestions = results.filter(r => !addedIds.has(r._id))

  function remove(i: number) {
    onChange(words.filter((_, idx) => idx !== i))
  }

  function linkWord(word: Word) {
    onChange([...words, word])
    setSearch(''); setDropdown(false)
  }

  function openForm() {
    setForm({ kelne: search, trad: '', clase: '' })
    setFormCat(inferred.cat)
    setShowForm(true); setDropdown(false)
  }

  function cancelForm() {
    setShowForm(false); setSearch('')
  }

  function handleCreate() {
    if (!form.kelne.trim() || !form.trad.trim()) return
    const isVerb = formCat === 'V'
    createWord.mutate(
      {
        cat:   formCat,
        tipo:  inferred.tipo,
        voz:   isVerb ? inferred.voz  : undefined,
        alin:  isVerb ? inferred.alin : undefined,
        kelne: form.kelne.trim(),
        trad:  form.trad.trim(),
        clase: form.clase.trim() || undefined,
        raiz:  rootId,
      },
      {
        onSuccess: newWord => {
          onChange([...words, newWord])
          setForm({ kelne: '', trad: '', clase: '' })
          setShowForm(false); setSearch('')
        },
      },
    )
  }

  const infoLabel = [
    formCat,
    inferred.tipo,
    formCat === 'V' ? inferred.voz  : undefined,
    formCat === 'V' ? inferred.alin : undefined,
  ].filter(Boolean).join('·')

  return (
    <div>
      <p className="text-xs text-stone-500 mb-1.5">Palabras derivadas</p>

      {/* Tabla de palabras enlazadas */}
      {words.length > 0 && (
        <table className="w-full border-collapse text-xs mb-3">
          <thead>
            <tr>
              {(['kelne', 'trad', 'info'] as const).map(h => (
                <th key={h} className="border border-stone-700 bg-stone-800 px-2 py-1 text-left text-stone-400 font-medium">
                  {h}
                </th>
              ))}
              <th className="border border-stone-700 bg-stone-800 w-8" />
            </tr>
          </thead>
          <tbody>
            {words.map((w, i) => (
              <tr key={w._id ?? i}>
                <td className={`${TD} font-mono`}>{w.kelne}</td>
                <td className={TD}>{w.trad}</td>
                <td className={`${TD} text-stone-500`}>{wordBadge(w)}</td>
                <td className={`${TD} text-center`}>
                  <button
                    onClick={() => remove(i)}
                    className="text-stone-600 hover:text-red-400 transition-colors text-lg leading-none"
                    aria-label="Desvincular"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Buscador */}
      {!showForm && (
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setDropdown(true) }}
            onFocus={() => search && setDropdown(true)}
            onBlur={() => setTimeout(() => setDropdown(false), 150)}
            placeholder="+ buscar o añadir palabra..."
            className="w-full px-3 py-1.5 text-xs border border-stone-700 rounded-md bg-stone-900 text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-stone-600"
          />

          {showDropdown && search.trim() && (
            <div className="absolute z-10 w-full mt-0.5 border border-stone-700 rounded-md bg-stone-800 shadow-xl overflow-hidden">
              {suggestions.map(r => (
                <button
                  key={r._id}
                  onMouseDown={() => linkWord(r)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-xs hover:bg-stone-700 text-left"
                >
                  <span className="font-mono text-stone-200 shrink-0">{r.kelne}</span>
                  <span className="text-stone-400 flex-1 truncate">{r.trad}</span>
                  <span className="text-stone-600 shrink-0">{wordBadge(r)}</span>
                </button>
              ))}
              <button
                onMouseDown={openForm}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-stone-700 text-stone-400 border-t border-stone-700"
              >
                <span>+</span>
                Crear «{search.trim()}» como {infoLabel}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Formulario inline de creación */}
      {showForm && (
        <div className="border border-stone-700 rounded-md bg-stone-900 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-500">
              Nueva palabra · <span className="text-stone-400">{infoLabel}</span>
            </p>
            {baseKey.type === 'verbo' && (
              <div className="flex rounded overflow-hidden border border-stone-700 text-xs">
                {(['V', 'N'] as WordCat[]).map(c => (
                  <button
                    key={c}
                    onClick={() => { setFormCat(c); setForm(f => ({ ...f, clase: '' })) }}
                    className={`px-2.5 py-0.5 transition-colors ${
                      formCat === c
                        ? 'bg-stone-600 text-stone-100'
                        : 'text-stone-500 hover:text-stone-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-stone-600 mb-0.5">kelne *</label>
              <input
                autoFocus
                value={form.kelne}
                onChange={e => setForm(f => ({ ...f, kelne: e.target.value }))}
                className="w-full px-2 py-1 text-xs border border-stone-700 rounded bg-stone-800 text-stone-100 font-mono focus:outline-none focus:ring-1 focus:ring-stone-500"
                placeholder="forma..."
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-0.5">trad *</label>
              <input
                value={form.trad}
                onChange={e => setForm(f => ({ ...f, trad: e.target.value }))}
                className="w-full px-2 py-1 text-xs border border-stone-700 rounded bg-stone-800 text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-500"
                placeholder="traducción..."
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-stone-600 mb-0.5">clase</label>
            {formCat === 'N' ? (
              <select
                value={form.clase}
                onChange={e => setForm(f => ({ ...f, clase: e.target.value }))}
                className="w-full px-2 py-1 text-xs border border-stone-700 rounded bg-stone-800 text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-500"
              >
                <option value="">— seleccionar —</option>
                {NOMBRE_CLASES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            ) : (
              <input
                value={form.clase}
                onChange={e => setForm(f => ({ ...f, clase: e.target.value }))}
                className="w-full px-2 py-1 text-xs border border-stone-700 rounded bg-stone-800 text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-500"
                placeholder="clase..."
              />
            )}
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button
              onClick={cancelForm}
              className="px-3 py-1 text-xs text-stone-500 hover:text-stone-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              disabled={!form.kelne.trim() || !form.trad.trim() || createWord.isPending}
              className="px-3 py-1 text-xs rounded bg-stone-700 hover:bg-stone-600 text-stone-100 transition-colors disabled:opacity-40"
            >
              {createWord.isPending ? 'Creando…' : 'Crear'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
