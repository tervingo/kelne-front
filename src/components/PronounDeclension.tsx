import { buildPronounDeclension, PRONOUN_CLASS_DEFS } from '../data/declension'

interface Props {
  kelne: string
  clase: string
}

const TH      = 'border border-stone-700 bg-stone-800 px-3 py-1 text-stone-400 font-medium text-left whitespace-nowrap'
const TD      = 'border border-stone-700 px-3 py-1 font-mono text-stone-200 whitespace-nowrap'
const TD_CASE = 'border border-stone-700 px-3 py-1 text-stone-500 font-medium text-xs whitespace-nowrap bg-stone-800/50'

export default function PronounDeclension({ kelne, clase }: Props) {
  const rows = buildPronounDeclension(kelne, clase)
  if (!rows) return null

  const def = PRONOUN_CLASS_DEFS[clase]

  return (
    <div>
      <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
        Declinación · {def.label}
      </p>
      <div className="overflow-x-auto">
        <table className="border-collapse text-xs">
          <thead>
            <tr>
              <th className={TH}>CASO</th>
              <th className={`${TH} text-center`}>FORMA</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.case}>
                <td className={TD_CASE}>{row.case}</td>
                <td className={`${TD} text-center`}>{row.form}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
