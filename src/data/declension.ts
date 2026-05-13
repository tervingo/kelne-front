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
  cases:       CaseDef[]
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
  ['au', 'ey'], ['ei', 'iei'], ['ie', 'ýe'], ['ue', 'yi'], ['ua', 'yy'],
  ['a',  'ae'], ['e',  'ei'],  ['i',  'ie'], ['o',  'ui'], ['u',  'y'],
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
      { case: 'DAT', sg: 'na',   pl: 'arna'                    },
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
      { case: 'DAT', sg: 'jana', pl: 'jarna'                   },
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
    extractBase: stripSuffix('jas'),
    cases: [
      { case: 'ABS', sg: 'ja',   pl: 'jái'                     },
      { case: 'AGE', sg: 'jas',  pl: 'jáis'                    },
      { case: 'GEN', sg: 'jen',  pl: 'jáin'                    },
      { case: 'ABL', sg: 'jat',  pl: 'jáit'                    },
      { case: 'DAT', sg: 'jana', pl: 'jarna'                   },
      { case: 'LOC', sg: 'jala', pl: 'jarla'                   },
      { case: 'INS', sg: 'jake', pl: 'jarke'                   },
      { case: 'COM', sg: 'jale', pl: 'jarle'                   },
      { case: 'ADE', sg: 'jane', pl: 'jarne'                   },
      { case: 'RES', sg: 'java', pl: 'jarva'                   },
      { case: 'PAR', sg: 'jja',  pl: null                      },
    ],
  },

  AA1: {
    label: 'AA1',
    extractBase: stripSuffix('as'),
    cases: [
      { case: 'ABS', sg: 'a',      pl: 'ar'                    },
      { case: 'AGE', sg: 'as',     pl: '(a)ras'                },
      { case: 'GEN', sg: 'in',     pl: 'arin',   mutateSg: true},
      { case: 'ABL', sg: 'at',     pl: '(a)rat'                },
      { case: 'DAT', sg: '(a)na',  pl: 'arna'                  },
      { case: 'LOC', sg: 'la',     pl: 'arla'                  },
      { case: 'INS', sg: '(a)ke',  pl: 'arke'                  },
      { case: 'COM', sg: 'le',     pl: 'arle'                  },
      { case: 'ADE', sg: '(a)ne',  pl: 'arne'                  },
      { case: 'RES', sg: '(a)va',  pl: 'arva'                  },
      { case: 'PAR', sg: 'ja',     pl: null                    },
    ],
  },

  AA2: {
    label: 'AA2',
    extractBase: stripSuffix('as'),
    cases: [
      { case: 'ABS', sg: 'a',      pl: 'ar'                    },
      { case: 'AGE', sg: 'as',     pl: '(a)ras'                },
      { case: 'GEN', sg: 'in',     pl: 'arin',                 },
      { case: 'ABL', sg: 'at',     pl: '(a)rat'                },
      { case: 'DAT', sg: '(a)na',  pl: 'arna'                  },
      { case: 'LOC', sg: 'la',     pl: 'arla'                  },
      { case: 'INS', sg: '(a)ke',  pl: 'arke'                  },
      { case: 'COM', sg: 'le',     pl: 'arle'                  },
      { case: 'ADE', sg: '(a)ne',  pl: 'arne'                  },
      { case: 'RES', sg: '(a)va',  pl: 'arva'                  },
      { case: 'PAR', sg: 'ja',     pl: null                    },
    ],
  },

  UC: {
    label: 'UC',
    extractBase: stripUcSuffix,
    cases: [
      { case: 'ABS', sg: 'us',    pl: 'úis'                    },
      { case: 'AGE', sg: 'us',    pl: 'úis'                    },
      { case: 'GEN', sg: 'usin',  pl: 'úisin'                  },
      { case: 'ABL', sg: 'usat',  pl: 'úisat'                  },
      { case: 'DAT', sg: 'usna',  pl: 'ustana'                 },
      { case: 'LOC', sg: 'usla',  pl: 'ustala'                 },
      { case: 'INS', sg: 'uske',  pl: 'ustake'                 },
      { case: 'COM', sg: 'usle',  pl: 'ustale'                 },
      { case: 'ADE', sg: 'usne',  pl: 'ustane'                 },
      { case: 'RES', sg: 'usva',  pl: 'ustava'                 },
      { case: 'PAR', sg: 'usja',  pl: null                     },
    ],
  },

  V1: {
    label: 'V1',
    extractBase: stripFinalVowel,
    cases: [
      { case: 'ABS', sg: 'e',    pl: 'er'                      },
      { case: 'AGE', sg: 'es',   pl: 'eras'                    },
      { case: 'GEN', sg: 'in',   pl: 'erin',   mutateSg: true  },
      { case: 'ABL', sg: 'et',   pl: 'erat'                    },
      { case: 'DAT', sg: 'ena',  pl: 'erna'                    },
      { case: 'LOC', sg: 'ela',  pl: 'erla'                    },
      { case: 'INS', sg: 'eke',  pl: 'erke'                    },
      { case: 'COM', sg: 'ele',  pl: 'erle'                    },
      { case: 'ADE', sg: 'ene',  pl: 'erne'                    },
      { case: 'RES', sg: 'eva',  pl: 'erva'                    },
      { case: 'PAR', sg: 'eja',  pl: null                      },
    ],
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

}

// ── Main function ─────────────────────────────────────────────────────────────

export function buildDeclension(kelne: string, clase: string): DeclRow[] | null {
  const def = NOMBRE_CLASS_DEFS[clase]
  if (!def) return null
  const base    = def.extractBase(kelne)
  const mutated = mutateBase(base)
  return def.cases.map(row => ({
    case:  row.case,
    sg:    (row.mutateSg ? mutated : base) + row.sg,
    pl:    row.pl === null ? null : (row.mutatePl ? mutated : base) + row.pl,
    ...(row.mutateSg            ? { sgMut: true as const } : {}),
    ...(row.mutatePl            ? { plMut: true as const } : {}),
  }))
}
