// Declension tables for noun classes.
// To add a new class: add an entry to NOMBRE_CLASS_DEFS.
// To change a desinence: edit the `sg`/`pl` strings in the relevant cases array.

export type NombreCase = 'ABS' | 'AGE' | 'GEN' | 'ABL' | 'DAT' | 'LOC' | 'INS' | 'COM' | 'ADE' | 'RES' | 'PAR'

export interface CaseDef {
  case:      NombreCase
  sg:        string
  pl:        string | null  // null = no plural (PAR)
  mutateSg?: true           // vowel mutation applies to SG base
  mutatePl?: true           // vowel mutation applies to PL base
}

export interface NombreClassDef {
  label:       string
  extractBase: (kelne: string) => string
  cases:       CaseDef[] | ((kelne: string) => CaseDef[])
}

export interface DeclRow {
  case:   NombreCase
  sg:     string
  pl:     string | null
  sgMut?: true
  plMut?: true
}

// ── Vowel mutations ───────────────────────────────────────────────────────────
// Longer patterns first to avoid partial matches (au before a, ei before e, etc.)

const VOWEL_MUTATIONS: [string, string][] = [
  ['au', 'ey'], ['ei', 'ii'], ['ie', 'ýe'], ['ue', 'yi'], ['ua', 'yy'],
  ['a',  'ae'], ['e',  'ý'],  ['i',  'ie'], ['o',  'ui'], ['u',  'y'],
]

export function mutateBase(base: string): string {
  for (const [from, to] of VOWEL_MUTATIONS) {
    const idx = base.lastIndexOf(from)
    if (idx !== -1) {
      return base.slice(0, idx) + to + base.slice(idx + from.length)
    }
  }
  return base
}

// Mutation only applies to monosyllabic bases (exactly one vowel nucleus).
const DIPHTHONGS = ['au', 'ei', 'ie', 'ue', 'ua']
const VOWELS     = new Set('aeiouáéíóúyý')

function countNuclei(base: string): number {
  let i = 0, n = 0
  while (i < base.length) {
    if (DIPHTHONGS.includes(base.slice(i, i + 2))) { n++; i += 2 }
    else if (VOWELS.has(base[i]))                   { n++; i++   }
    else                                             {      i++   }
  }
  return n
}

export function isMonosyllabic(base: string): boolean {
  return countNuclei(base) === 1
}

// ── Base extraction helpers ───────────────────────────────────────────────────

function stripSuffix(suffix: string) {
  return (kelne: string) =>
    kelne.endsWith(suffix) ? kelne.slice(0, -suffix.length) : kelne
}

function stripFinalVowel(kelne: string): string {
  return kelne.replace(/[aeiouáéíóú]$/u, '')
}

function stripUcSuffix(kelne: string): string {
  if (kelne.endsWith('ur')) return kelne.slice(0, -2)
  if (kelne.endsWith('us')) return kelne.slice(0, -2)
  return kelne
}

// ── Class definitions ─────────────────────────────────────────────────────────
// kelne stored as: AH1/AH2/AA1 = AGE form; UC = ABS form; V1 = ABS form; C1 = base itself

export const NOMBRE_CLASS_DEFS: Record<string, NombreClassDef> = {

  AH1: {
    label: 'AH1',
    extractBase: stripSuffix('as'),
    cases: [
      { case: 'ABS', sg: 'a',    pl: 'ái'                      },
      { case: 'AGE', sg: 'as',   pl: 'áis'                     },
      { case: 'GEN', sg: 'in',   pl: 'áin',  mutateSg: true    },
      { case: 'ABL', sg: 'at',   pl: 'áit'                     },
      { case: 'DAT', sg: 'u',    pl: 'áu'                      },
      { case: 'LOC', sg: 'la',   pl: 'arla'                    },
      { case: 'INS', sg: 'ke',   pl: 'arke'                    },
      { case: 'COM', sg: 'le',   pl: 'arle'                    },
      { case: 'ADE', sg: 'ne',   pl: 'arne'                    },
      { case: 'RES', sg: 'va',   pl: 'arva'                    },
      { case: 'PAR', sg: 'ja',   pl: null                      },
    ],
  },

  AH2: {
    label: 'AH2',
    extractBase: stripSuffix('jas'),
    cases: [
      { case: 'ABS', sg: 'ja',   pl: 'jái'                     },
      { case: 'AGE', sg: 'jas',  pl: 'jáis'                    },
      { case: 'GEN', sg: 'jen',  pl: 'jáin'                    },
      { case: 'ABL', sg: 'jat',  pl: 'jáit'                    },
      { case: 'DAT', sg: 'ju',   pl: 'jáu'                   },
      { case: 'LOC', sg: 'jala', pl: 'jarla'                   },
      { case: 'INS', sg: 'jake', pl: 'jarke'                   },
      { case: 'COM', sg: 'jale', pl: 'jarle'                   },
      { case: 'ADE', sg: 'jane', pl: 'jarne'                   },
      { case: 'RES', sg: 'java', pl: 'jarva'                   },
      { case: 'PAR', sg: 'jja',  pl: null                      },
    ],
  },

  AH3: {
    label: 'AH3',
    extractBase: stripSuffix('as'),
    cases: [
      { case: 'ABS', sg: 'a',    pl: 'ái'                      },
      { case: 'AGE', sg: 'as',   pl: 'áis'                     },
      { case: 'GEN', sg: 'in',   pl: 'áin',                    },
      { case: 'ABL', sg: 'at',   pl: 'áit'                     },
      { case: 'DAT', sg: 'u',    pl: 'áu'                    },
      { case: 'LOC', sg: 'la',   pl: 'arla'                    },
      { case: 'INS', sg: 'ke',   pl: 'arke'                    },
      { case: 'COM', sg: 'le',   pl: 'arle'                    },
      { case: 'ADE', sg: 'ne',   pl: 'arne'                    },
      { case: 'RES', sg: 'va',   pl: 'arva'                    },
      { case: 'PAR', sg: 'ja',   pl: null                      },
    ],
  },

  AA1: {
    label: 'AA1',
    extractBase: stripSuffix('as'),
    cases: [
      { case: 'ABS', sg: 'a',      pl: 'ar'                    },
      { case: 'AGE', sg: 'as',     pl: 'ras'                },
      { case: 'GEN', sg: 'in',     pl: 'rin',   mutateSg: true, mutatePl: true },
      { case: 'ABL', sg: 'at',     pl: 'rat'                },
      { case: 'DAT', sg: 'na',  pl: 'arna'                  },
      { case: 'LOC', sg: 'la',     pl: 'arla'                  },
      { case: 'INS', sg: 'ke',  pl: 'arke'                  },
      { case: 'COM', sg: 'le',     pl: 'arle'                  },
      { case: 'ADE', sg: 'ne',  pl: 'arne'                  },
      { case: 'RES', sg: 'va',  pl: 'arva'                  },
      { case: 'PAR', sg: 'ja',     pl: null                    },
    ],
  },

  AA2: {
    label: 'AA2',
    extractBase: stripSuffix('as'),
    cases: [
      { case: 'ABS', sg: 'a',      pl: 'ar'                    },
      { case: 'AGE', sg: 'as',     pl: 'aras'                },
      { case: 'GEN', sg: 'en',     pl: 'arin',                 },
      { case: 'ABL', sg: 'at',     pl: 'arat'                },
      { case: 'DAT', sg: 'na',     pl: 'arna'                  },
      { case: 'LOC', sg: 'la',     pl: 'arla'                  },
      { case: 'INS', sg: 'ke',     pl: 'arke'                  },
      { case: 'COM', sg: 'le',     pl: 'arle'                  },
      { case: 'ADE', sg: 'ne',     pl: 'arne'                  },
      { case: 'RES', sg: 'va',     pl: 'arva'                  },
      { case: 'PAR', sg: 'ja',     pl: null                    },
    ],
  },

  UC: {
    label: 'UC',
    extractBase: stripUcSuffix,
    cases: (kelne: string): CaseDef[] => {
      const s = kelne.endsWith('ur') ? 'ur' : 'us'
      const p = kelne.endsWith('ur') ? 'úir' : 'úis'
      return [
        { case: 'ABS', sg: s,           pl: p            },
        { case: 'AGE', sg: s,           pl: p            },
        { case: 'GEN', sg: `${s}in`,    pl: `${p}in`     },
        { case: 'ABL', sg: `${s}at`,    pl: `${p}at`     },
        { case: 'DAT', sg: `${s}na`,    pl: `${s}tana`   },
        { case: 'LOC', sg: `${s}la`,    pl: `${s}tala`   },
        { case: 'INS', sg: `${s}ke`,    pl: `${s}take`   },
        { case: 'COM', sg: `${s}le`,    pl: `${s}tale`   },
        { case: 'ADE', sg: `${s}ne`,    pl: `${s}tane`   },
        { case: 'RES', sg: `${s}va`,    pl: `${s}tava`   },
        { case: 'PAR', sg: `${s}ja`,    pl: null         },
      ]
    },
  },

  V1: {
    label: 'V1',
    extractBase: stripFinalVowel,
    cases: (kelne: string): CaseDef[] => {
      const v = kelne.endsWith('o') ? 'o' : 'e'
      return [
        { case: 'ABS', sg: v,          pl: `${v}r`            },
        { case: 'AGE', sg: `${v}s`,    pl: `${v}ras`          },
        { case: 'GEN', sg: 'in',       pl: `${v}rin`, mutateSg: true },
        { case: 'ABL', sg: `${v}t`,    pl: `${v}rat`          },
        { case: 'DAT', sg: `${v}na`,   pl: `${v}rna`          },
        { case: 'LOC', sg: `${v}la`,   pl: `${v}rla`          },
        { case: 'INS', sg: `${v}ke`,   pl: `${v}rke`          },
        { case: 'COM', sg: `${v}le`,   pl: `${v}rle`          },
        { case: 'ADE', sg: `${v}ne`,   pl: `${v}rne`          },
        { case: 'RES', sg: `${v}va`,   pl: `${v}rva`          },
        { case: 'PAR', sg: `${v}ja`,   pl: null               },
      ]
    },
  },

  V2: {
    label: 'V2',
    extractBase: stripFinalVowel,
    cases: (kelne: string): CaseDef[] => {
      const v = kelne.endsWith('o') ? 'o' : 'e'
      return [
        { case: 'ABS', sg: v,          pl: `${v}r`            },
        { case: 'AGE', sg: `${v}s`,    pl: `${v}ras`          },
        { case: 'GEN', sg: 'en',       pl: `${v}rin`          },
        { case: 'ABL', sg: `${v}t`,    pl: `${v}rat`          },
        { case: 'DAT', sg: `${v}na`,   pl: `${v}rna`          },
        { case: 'LOC', sg: `${v}la`,   pl: `${v}rla`          },
        { case: 'INS', sg: `${v}ke`,   pl: `${v}rke`          },
        { case: 'COM', sg: `${v}le`,   pl: `${v}rle`          },
        { case: 'ADE', sg: `${v}ne`,   pl: `${v}rne`          },
        { case: 'RES', sg: `${v}va`,   pl: `${v}rva`          },
        { case: 'PAR', sg: `${v}ja`,   pl: null               },
      ]
    },
  },


  C1: {
    label: 'C1',
    extractBase: k => k,
    cases: [
      { case: 'ABS', sg: '',     pl: 'ta'                      },
      { case: 'AGE', sg: 'as',   pl: 'tas'                     },
      { case: 'GEN', sg: 'in',   pl: 'tin',  mutateSg: true, mutatePl: true },
      { case: 'ABL', sg: 'at',   pl: 'tat'                     },
      { case: 'DAT', sg: 'na',   pl: 'tana'                    },
      { case: 'LOC', sg: 'la',   pl: 'tala'                    },
      { case: 'INS', sg: 'ke',   pl: 'take'                    },
      { case: 'COM', sg: 'le',   pl: 'tale'                    },
      { case: 'ADE', sg: 'ne',   pl: 'tane'                    },
      { case: 'RES', sg: 'va',   pl: 'tava'                    },
      { case: 'PAR', sg: 'ja',   pl: null                      },
    ],
  },

  C2: {
    label: 'C2',
    extractBase: k => k,
    cases: [
      { case: 'ABS', sg: '',     pl: 'ta'                      },
      { case: 'AGE', sg: 'as',   pl: 'tas'                     },
      { case: 'GEN', sg: 'in',   pl: 'tin',                    },
      { case: 'ABL', sg: 'at',   pl: 'tat'                     },
      { case: 'DAT', sg: 'na',   pl: 'tana'                    },
      { case: 'LOC', sg: 'la',   pl: 'tala'                    },
      { case: 'INS', sg: 'ke',   pl: 'take'                    },
      { case: 'COM', sg: 'le',   pl: 'tale'                    },
      { case: 'ADE', sg: 'ne',   pl: 'tane'                    },
      { case: 'RES', sg: 'va',   pl: 'tava'                    },
      { case: 'PAR', sg: 'ja',   pl: null                      },
    ],
  },

}

// ── Main function ─────────────────────────────────────────────────────────────

export function buildDeclension(kelne: string, clase: string): DeclRow[] | null {
  const def = NOMBRE_CLASS_DEFS[clase]
  if (!def) return null
  const base      = def.extractBase(kelne)
  const monosyl   = isMonosyllabic(base)
  const mutated   = monosyl ? mutateBase(base) : base
  const caseDefs  = typeof def.cases === 'function' ? def.cases(kelne) : def.cases
  return caseDefs.map((row: CaseDef) => {
    const applySg  = !!(row.mutateSg && monosyl)
    const applyPl  = !!(row.mutatePl && monosyl)
    const changed  = mutated !== base
    return {
      case: row.case,
      sg:   (applySg ? mutated : base) + row.sg,
      pl:   row.pl === null ? null : (applyPl ? mutated : base) + row.pl,
      ...(applySg && changed ? { sgMut: true as const } : {}),
      ...(applyPl && changed ? { plMut: true as const } : {}),
    }
  })
}
