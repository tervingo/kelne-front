import type { DerivedWord } from '../types/root'

interface Props {
  words: DerivedWord[]
  onChange: (words: DerivedWord[]) => void
}

const INPUT = 'w-full bg-transparent text-stone-200 text-sm focus:outline-none placeholder-stone-600'
const TD    = 'border border-stone-700 px-2 py-1.5 bg-stone-900'

export default function DerivedWordTable({ words, onChange }: Props) {
  function update(i: number, field: keyof DerivedWord, value: string) {
    onChange(words.map((w, idx) => (idx === i ? { ...w, [field]: value } : w)))
  }

  function remove(i: number) {
    onChange(words.filter((_, idx) => idx !== i))
  }

  function addRow() {
    onChange([...words, { word: '', translation: '', wordClass: '' }])
  }

  return (
    <div>
      <p className="text-xs text-stone-500 mb-1.5">Palabras derivadas</p>

      {words.length > 0 && (
        <table className="w-full border-collapse text-sm mb-2">
          <thead>
            <tr>
              {(['Palabra', 'Traducción', 'Clase'] as const).map(h => (
                <th key={h} className="border border-stone-700 bg-stone-800 px-2 py-1 text-left text-xs text-stone-400 font-medium">
                  {h}
                </th>
              ))}
              <th className="border border-stone-700 bg-stone-800 w-8" />
            </tr>
          </thead>
          <tbody>
            {words.map((w, i) => (
              <tr key={i}>
                <td className={TD}>
                  <input value={w.word} onChange={e => update(i, 'word', e.target.value)}
                    className={INPUT} placeholder="palabra" />
                </td>
                <td className={TD}>
                  <input value={w.translation} onChange={e => update(i, 'translation', e.target.value)}
                    className={INPUT} placeholder="traducción" />
                </td>
                <td className={TD}>
                  <input value={w.wordClass} onChange={e => update(i, 'wordClass', e.target.value)}
                    className={INPUT} placeholder="clase" />
                </td>
                <td className={`${TD} text-center`}>
                  <button
                    onClick={() => remove(i)}
                    className="text-stone-600 hover:text-red-400 transition-colors text-lg leading-none"
                    aria-label="Eliminar"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={addRow}
        className="text-xs text-stone-500 hover:text-stone-300 transition-colors"
      >
        + añadir palabra
      </button>
    </div>
  )
}
