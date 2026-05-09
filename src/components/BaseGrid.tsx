import type { Base, BaseKey, Degree, Voice, Conjugation, WordType } from '../types/root'

interface Props {
  bases: Base[]
  selectedKey: BaseKey | null
  onSelect: (key: BaseKey) => void
}

const DEGREES: Degree[] = ['normal', 'fuerte', 'largo']

type ColDef = { type: WordType; voice?: Voice; conjugation?: Conjugation; label: string }

const COLS: ColDef[] = [
  { type: 'nombre',                                                  label: 'nombre'     },
  { type: 'verbo', voice: 'activa', conjugation: 'agentiva',        label: 'activa·ag'  },
  { type: 'verbo', voice: 'activa', conjugation: 'receptiva',       label: 'activa·rec' },
  { type: 'verbo', voice: 'media',  conjugation: 'agentiva',        label: 'media·ag'   },
  { type: 'verbo', voice: 'media',  conjugation: 'receptiva',       label: 'media·rec'  },
]

function findBase(bases: Base[], key: BaseKey): Base | undefined {
  return bases.find(
    b =>
      b.degree === key.degree &&
      b.type === key.type &&
      b.voice === key.voice &&
      b.conjugation === key.conjugation,
  )
}

function keysMatch(a: BaseKey | null, b: BaseKey): boolean {
  if (!a) return false
  return (
    a.degree === b.degree &&
    a.type === b.type &&
    a.voice === b.voice &&
    a.conjugation === b.conjugation
  )
}

const TH = 'border border-stone-700 bg-stone-800 px-3 py-1.5 text-stone-400 font-medium whitespace-nowrap'
const TH_SUB = 'border border-stone-700 bg-stone-800 px-3 py-1.5 text-stone-500 font-normal whitespace-nowrap'
const TD_DEGREE = 'border border-stone-700 bg-stone-800 px-3 py-2 text-stone-400 font-medium capitalize text-xs whitespace-nowrap'

export default function BaseGrid({ bases, selectedKey, onSelect }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className={TH} />
            <th className={`${TH} text-center`} rowSpan={2}>NOMBRE</th>
            <th className={`${TH} text-center`} colSpan={4}>VERBO</th>
          </tr>
          <tr>
            <th className={TH} />
            {COLS.slice(1).map(col => (
              <th key={col.label} className={`${TH_SUB} text-center`}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DEGREES.map(degree => (
            <tr key={degree}>
              <td className={TD_DEGREE}>{degree}</td>
              {COLS.map(col => {
                const key: BaseKey = { degree, type: col.type, voice: col.voice, conjugation: col.conjugation }
                const base = findBase(bases, key)
                const selected = keysMatch(selectedKey, key)
                return (
                  <td
                    key={col.label}
                    onClick={() => onSelect(key)}
                    className={`border border-stone-700 px-2 py-2 text-center cursor-pointer transition-colors min-w-[72px] ${
                      selected
                        ? 'bg-amber-800/60 text-amber-100 ring-1 ring-inset ring-amber-500'
                        : base
                          ? 'bg-stone-800 text-stone-200 hover:bg-stone-700'
                          : 'bg-stone-950 text-stone-600 hover:bg-stone-900'
                    }`}
                  >
                    {base ? (
                      <span className="block truncate max-w-[96px] mx-auto">{base.translation}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
