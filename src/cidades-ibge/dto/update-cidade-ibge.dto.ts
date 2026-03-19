import { z } from 'zod';

const estadoValues = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const;

const regiaoValues = [
  'NORTE',
  'NORDESTE',
  'CENTRO_OESTE',
  'SUDESTE',
  'SUL',
] as const;

const biomaValues = [
  'AMAZONIA',
  'CERRADO',
  'MATA_ATLANTICA',
  'CAATINGA',
  'PAMPA',
  'PANTANAL',
] as const;

export const updateCidadeIbgeSchema = z.object({
  codigoIBGE: z.string().min(1).optional(),
  cidade: z.string().min(1).optional(),
  estado: z.enum(estadoValues).optional(),
  regiao: z.enum(regiaoValues).optional(),
  bioma: z.enum(biomaValues).optional().nullable(),
});

export type UpdateCidadeIbgeDto = z.infer<typeof updateCidadeIbgeSchema>;
