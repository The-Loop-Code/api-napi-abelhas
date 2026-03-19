import { z } from 'zod';

const estadoValues = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;

const regiaoValues = [
  'NORTE', 'NORDESTE', 'CENTRO_OESTE', 'SUDESTE', 'SUL',
] as const;

const biomaValues = [
  'AMAZONIA', 'CERRADO', 'MATA_ATLANTICA', 'CAATINGA', 'PAMPA', 'PANTANAL',
] as const;

export const createCidadeIbgeSchema = z.object({
  codigoIBGE: z.string().min(1),
  cidade: z.string().min(1),
  estado: z.enum(estadoValues),
  regiao: z.enum(regiaoValues),
  bioma: z.enum(biomaValues).optional(),
});

export type CreateCidadeIbgeDto = z.infer<typeof createCidadeIbgeSchema>;
