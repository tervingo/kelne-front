import { useState } from 'react'
import type { Word, WordCat } from '../types/word'
import {
  WORD_CAT_LABELS, NOMBRE_CLASES, NOMBRE_TIPO_LABELS,
  VERBO_TIPO_LABELS, AFIJO_TIPO_LABELS, VOZ_LABELS, ALIN_LABELS,
} from '../types/word'
import { useWord, useCreateWord, useUpdateWord, useDeleteWord } from '../hooks/useWords'
import { useRoots } from '../hooks/useRoots'

interface Props {
  wordId:     string | 'new'
  onCreated?: (id: string) => void
  onDeleted?: () => void
}

// ── Loader ────────────────────────────────────────────────────────────────────

export default function WordEditor({ wordId, onCreated, onDeleted }: Props) {
  const isNew = wordId === 'new'
  const { data: word, isLoading } = useWord(isNew ? null : wordId)

  if (!isNew && isLoading) return <p className="text-sm text-stone-500">Cargando...</p>
  if (!isNew && !word)     return null

  return (
    <WordForm
      key={isNew ? 'new' : word!._id}
      word={isNew ? undefined : word}
      onCreated={onCreated}
      onDeleted={onDeleted}
    />
  )
}

// ── Form ──────────────────────────────────────────────────────────────────────

interface FormProps {
  word?:      Word
  onCreated?: (id: string) => void
  onDeleted?: () => void
}

const CATS: WordCat[] = ['N', 'V', 'PN', 'DT', 'AV', 'AF', 'CJ', 'PT']

const INPUT  = 'w-full px-3 py-1.5 text-sm border border-stone-700 rounded-md bg-stone-800 text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-stone-500'
const SELECT = `${INPUT} cursor-pointer`
const LABEL  = 'block text-xs text-stone-500 mb-1'

function WordForm({ word, onCreated, onDeleted }: FormProps) {
  const createWord = useCreateWord()
  const updateWord = useUpdateWord()
  const deleteWord = useDeleteWord()

  const [confirmDelete, setConfirmDelete] = useState(false)

  const [cat,   setCat]   = useState<WordCat>(word?.cat   ?? 'N')
  const [kelne, setKelne] = useState(word?.kelne ?? '')
  const [trad,  setTrad]  = useState(word?.trad  ?? '')
  const [com,   setCom]   = useState(word?.com   ?? '')
  const [tipo,  setTipo]  = useState(word?.tipo  ?? '')
  const [clase, setClase] = useState(word?.clase ?? '')
  const [voz,   setVoz]   = useState(word?.voz   ?? '')
  const [alin,  setAlin]  = useState(word?.alin  ?? '')

  // Single root — stores the root name string (natural key)
  const [linkedRoot,  setLinkedRoot]  = useState(
    typeof word?.raiz === 'string' ? word.raiz : ''
  )
  // Compound roots — list of root name strings
  const [linkedRoots, setLinkedRoots] = useState<string[]>(
    Array.isArray(word?.raiz) ? word.raiz : []
  )
  const [rootSearch,   setRootSearch]   = useState('')
  const [showRootDrop, setShowRootDrop] = useState(false)

  const { data: rootSuggestions = [] } = useRoots(rootSearch || undefined)
  const isPending = createWord.isPending || updateWord.isPending || deleteWord.isPending

  function handleDelete() {
    if (!word?._id) return
    deleteWord.mutate(word._id, { onSuccess: () => onDeleted?.() })
  }

  const needsRoot   = cat === 'N' || cat === 'V'
  const isVerb      = cat === 'V'
  const isNombre    = cat === 'N'
  const isAfijo     = cat === 'AF'
  const isCompuesto = isNombre && tipo === 'C'

  function addRoot(root: string) {
    if (!linkedRoots.includes(root)) setLinkedRoots(prev => [...prev, root])
    setRootSearch(''); setShowRootDrop(false)
  }

  function handleSave() {
    const raiz = isCompuesto
      ? (linkedRoots.length >= 2 ? linkedRoots : undefined)
      : (linkedRoot || undefined)

    const payload: Omit<Word, '_id'> = {
      cat, kelne: kelne.trim(), trad: trad.trim(),
      com:   com.trim()   || undefined,
      tipo:  tipo.trim()  || undefined,
      clase: clase.trim() || undefined,
      raiz,
      voz:   (voz as Word['voz'])   || undefined,
      alin:  (alin as Word['alin']) || undefined,
    }
    if (word) {
      updateWord.mutate({ id: word._id!, data: payload })
    } else {
      createWord.mutate(payload, {
        onSuccess: created => onCreated?.(created._id!),
      })
    }
  }

  return (
    <div className="space-y-5">

      {/* ── Campos comunes ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
        <div>
          <label className={LABEL}>Categoría *</label>
          <select value={cat} onChange={e => setCat(e.target.value as WordCat)} className={SELECT}>
            {CATS.map(c => (
              <option key={c} value={c}>{c} — {WORD_CAT_LABELS[c]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL}>kelne *</label>
          <input value={kelne} onChange={e => setKelne(e.target.value)} placeholder="forma..." className={`${INPUT} font-mono`} />
        </div>
        <div className="col-span-2">
          <label className={LABEL}>Traducción *</label>
          <input value={trad} onChange={e => setTrad(e.target.value)} placeholder="traducción..." className={INPUT} />
        </div>
      </div>

      {/* ── Campos por categoría ──────────────────────────────────────── */}
      {(isNombre || isVerb || isAfijo) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

          {/* tipo */}
          <div>
            <label className={LABEL}>Tipo *</label>
            {isNombre && (
              <select value={tipo} onChange={e => setTipo(e.target.value)} className={SELECT}>
                <option value="">—</option>
                {(Object.keys(NOMBRE_TIPO_LABELS) as (keyof typeof NOMBRE_TIPO_LABELS)[]).map(k => (
                  <option key={k} value={k}>{k} — {NOMBRE_TIPO_LABELS[k]}</option>
                ))}
              </select>
            )}
            {isVerb && (
              <select value={tipo} onChange={e => setTipo(e.target.value)} className={SELECT}>
                <option value="">—</option>
                {(Object.keys(VERBO_TIPO_LABELS) as (keyof typeof VERBO_TIPO_LABELS)[]).map(k => (
                  <option key={k} value={k}>{k} — {VERBO_TIPO_LABELS[k]}</option>
                ))}
              </select>
            )}
            {isAfijo && (
              <select value={tipo} onChange={e => setTipo(e.target.value)} className={SELECT}>
                <option value="">—</option>
                {(Object.keys(AFIJO_TIPO_LABELS) as (keyof typeof AFIJO_TIPO_LABELS)[]).map(k => (
                  <option key={k} value={k}>{k} — {AFIJO_TIPO_LABELS[k]}</option>
                ))}
              </select>
            )}
          </div>

          {/* clase */}
          {(isNombre || isVerb) && (
            <div>
              <label className={LABEL}>Clase {isNombre ? '*' : ''}</label>
              {isNombre ? (
                <select value={clase} onChange={e => setClase(e.target.value)} className={SELECT}>
                  <option value="">—</option>
                  {NOMBRE_CLASES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : (
                <input value={clase} onChange={e => setClase(e.target.value)} placeholder="clase..." className={INPUT} />
              )}
            </div>
          )}

          {/* voz + alin (verbos) */}
          {isVerb && (
            <>
              <div>
                <label className={LABEL}>Voz *</label>
                <select value={voz} onChange={e => setVoz(e.target.value)} className={SELECT}>
                  <option value="">—</option>
                  {(Object.keys(VOZ_LABELS) as (keyof typeof VOZ_LABELS)[]).map(k => (
                    <option key={k} value={k}>{k} — {VOZ_LABELS[k]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL}>Alineación *</label>
                <select value={alin} onChange={e => setAlin(e.target.value)} className={SELECT}>
                  <option value="">—</option>
                  {(Object.keys(ALIN_LABELS) as (keyof typeof ALIN_LABELS)[]).map(k => (
                    <option key={k} value={k}>{k} — {ALIN_LABELS[k]}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Raíz ──────────────────────────────────────────────────────── */}
      {needsRoot && (
        <div>
          <label className={LABEL}>Raíz {isVerb || isCompuesto ? '*' : ''}</label>

          {isCompuesto ? (
            /* Multi-root selector for compound nouns */
            <div className="space-y-2">
              {linkedRoots.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {linkedRoots.map(r => (
                    <span
                      key={r}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-sm border border-stone-600 rounded-md bg-stone-800 font-mono text-stone-200"
                    >
                      {r}
                      <button
                        onClick={() => setLinkedRoots(prev => prev.filter(x => x !== r))}
                        className="text-stone-500 hover:text-red-400 transition-colors text-base leading-none ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="relative">
                <input
                  value={rootSearch}
                  onChange={e => { setRootSearch(e.target.value); setShowRootDrop(true) }}
                  onFocus={() => rootSearch && setShowRootDrop(true)}
                  onBlur={() => setTimeout(() => setShowRootDrop(false), 150)}
                  placeholder="Añadir raíz..."
                  className={INPUT}
                />
                {showRootDrop && rootSearch && rootSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-0.5 border border-stone-700 rounded-md bg-stone-800 shadow-xl overflow-hidden">
                    {rootSuggestions
                      .filter(r => !linkedRoots.includes(r.root))
                      .map(r => (
                        <button
                          key={r._id}
                          onMouseDown={() => addRoot(r.root)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-stone-700 font-mono text-stone-200"
                        >
                          {r.root}
                        </button>
                      ))
                    }
                  </div>
                )}
              </div>
              {linkedRoots.length < 2 && (
                <p className="text-xs text-stone-600">Mínimo 2 raíces para un nombre compuesto</p>
              )}
            </div>
          ) : (
            /* Single root selector */
            linkedRoot ? (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 text-sm border border-stone-700 rounded-md bg-stone-800 text-stone-100 font-mono flex-1">
                  {linkedRoot}
                </span>
                <button
                  onClick={() => { setLinkedRoot(''); setRootSearch('') }}
                  className="text-stone-500 hover:text-red-400 transition-colors text-lg"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  value={rootSearch}
                  onChange={e => { setRootSearch(e.target.value); setShowRootDrop(true) }}
                  onFocus={() => rootSearch && setShowRootDrop(true)}
                  onBlur={() => setTimeout(() => setShowRootDrop(false), 150)}
                  placeholder="Buscar raíz..."
                  className={INPUT}
                />
                {showRootDrop && rootSearch && rootSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-0.5 border border-stone-700 rounded-md bg-stone-800 shadow-xl overflow-hidden">
                    {rootSuggestions.map(r => (
                      <button
                        key={r._id}
                        onMouseDown={() => {
                          setLinkedRoot(r.root)
                          setRootSearch('')
                          setShowRootDrop(false)
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-stone-700 font-mono text-stone-200"
                      >
                        {r.root}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}

      {/* ── Comentario ────────────────────────────────────────────────── */}
      <div>
        <label className={LABEL}>Comentario</label>
        <textarea
          value={com}
          onChange={e => setCom(e.target.value)}
          rows={2}
          placeholder="Notas opcionales..."
          className={`${INPUT} resize-none`}
        />
      </div>

      {/* ── Guardar / Eliminar ────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          {word && (
            confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400">¿Eliminar esta palabra?</span>
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="px-3 py-1 text-xs rounded-md bg-red-800 hover:bg-red-700 text-red-100 transition-colors disabled:opacity-40"
                >
                  {deleteWord.isPending ? 'Eliminando…' : 'Sí, eliminar'}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1 text-xs text-stone-500 hover:text-stone-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:text-red-400 transition-colors"
              >
                Eliminar
              </button>
            )
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={isPending || !kelne.trim() || !trad.trim()}
          className="px-4 py-1.5 text-sm rounded-md bg-stone-700 hover:bg-stone-600 text-stone-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending && !deleteWord.isPending ? 'Guardando…' : 'Guardar'}
        </button>
      </div>

    </div>
  )
}
