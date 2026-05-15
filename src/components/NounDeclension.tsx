import { buildDeclension, NOMBRE_CLASS_DEFS } from '../data/declension'

interface Props {
  kelne: string
  clase: string
}

const TH = 'border border-stone-700 bg-stone-800 px-3 py-1 text-stone-400 font-medium text-left whitespace-nowrap'
const TD = 'border border-stone-700 px-3 py-1 font-mono text-stone-200 whitespace-nowrap'
const TD_CASE = 'border border-stone-700 px-3 py-1 text-stone-500 font-medium text-xs whitespace-nowrap bg-stone-800/50'
const TD_MUT  = 'border border-stone-700 px-3 py-1 font-mono text-amber-400 whitespace-nowrap'

export default function NounDeclension({ kelne, clase }: Props) {
  const rows = buildDeclension(kelne, clase)
  if (!rows) return null

  const def = NOMBRE_CLASS_DEFS[clase]

  return (
    <div>
      <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
        Declinación · {def.label}
      </p>
      <div className="overflow-x-auto">
        <table className="border-collapse text-base">
          <thead>
            <tr>
              <th className={TH}>CASO</th>
              <th className={`${TH} text-center`}>SG</th>
              <th className={`${TH} text-center`}>PL</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.case}>
                <td className={TD_CASE}>{row.case}</td>
                <td className={`${row.sgMut ? TD_MUT : TD} text-center`}>{row.sg}</td>
                <td className={`${row.plMut ? TD_MUT : TD} text-center`}>
                  {row.pl ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-stone-600 mt-1.5">
        Las formas en <span className="text-amber-500">ámbar</span> llevan mutación vocálica de la base.
      </p>
    </div>
  )
}
