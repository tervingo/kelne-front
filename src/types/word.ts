export type WordCat = 'N' | 'V' | 'PN' | 'DT' | 'AV' | 'AF' | 'CJ' | 'PT'

export type NombreTipo = 'P' | 'R' | 'C' | 'DN' | 'DL' | 'DF'
export type VerboTipo  = 'ND' | 'DN' | 'DL' | 'DF'
export type AfijoTipo  = 'P' | 'S'

export type NombreClase = 'AH1' | 'AH2' | 'AA1' | 'UC' | 'V1' | 'C1' | 'I1'
export type Voz  = 'A' | 'M'
export type Alin = 'AGT' | 'RCT'

export const WORD_CAT_LABELS: Record<WordCat, string> = {
  N:  'Nombre',
  V:  'Verbo',
  PN: 'Pronombre',
  DT: 'Determinante',
  AV: 'Adverbio',
  AF: 'Afijo',
  CJ: 'Conjunción',
  PT: 'Partícula',
}

export const NOMBRE_TIPO_LABELS: Record<NombreTipo, string> = {
  P:  'Primario',
  R:  'Radical',
  C:  'Compuesto',
  DN: 'Deriv. normal',
  DL: 'Deriv. largo',
  DF: 'Deriv. fuerte',
}

export const VERBO_TIPO_LABELS: Record<VerboTipo, string> = {
  ND: 'No derivado',
  DN: 'Deriv. normal',
  DL: 'Deriv. largo',
  DF: 'Deriv. fuerte',
}

export const AFIJO_TIPO_LABELS: Record<AfijoTipo, string> = {
  P: 'Prefijo',
  S: 'Sufijo',
}

export const NOMBRE_CLASES: NombreClase[] = ['AH1', 'AH2', 'AA1', 'UC', 'V1', 'C1', 'I1']

export const VOZ_LABELS: Record<Voz, string>  = { A: 'activa', M: 'media' }
export const ALIN_LABELS: Record<Alin, string> = { AGT: 'agentiva', RCT: 'receptiva' }

export interface Word {
  _id?:   string
  cat:    WordCat
  kelne:  string
  trad:   string
  com?:   string
  tipo?:  string   // NombreTipo | VerboTipo | AfijoTipo
  clase?: string
  raiz?:  string | string[]  // string para simples, array para compuestos (tipo C)
  voz?:   Voz
  alin?:  Alin
}

export function wordBadge(w: Word): string {
  const parts: string[] = [w.cat]
  if (w.tipo)  parts.push(w.tipo)
  if (w.voz)   parts.push(w.voz)
  if (w.alin)  parts.push(w.alin)
  if (w.clase) parts.push(w.clase)
  return parts.join('·')
}
