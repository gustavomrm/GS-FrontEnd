import type { MotivoPendencia, SituacaoAtendimento } from '@/types/api'

export const situacoes: SituacaoAtendimento[] = [
  'AGUARDANDO',
  'DESIGNADA',
  'EQUIPE_A_CAMINHO',
  'EMBARCADA',
  'CHEGADA_CONFIRMADA',
  'RECUSADO',
]

export const motivos: MotivoPendencia[] = ['SEM_CONTATO', 'ACESSO_IMPEDIDO', 'SEM_RECURSO', 'SAIDA_PROPRIA_PENDENTE']

export const nomeSituacao = {
  AGUARDANDO: 'Aguardando',
  DESIGNADA: 'Transporte designado',
  EQUIPE_A_CAMINHO: 'Equipe a caminho',
  EMBARCADA: 'Embarcada',
  CHEGADA_CONFIRMADA: 'Chegada confirmada',
  RECUSADO: 'Recusou a saída',
}

export const nomeMotivo = {
  SEM_CONTATO: 'Sem contato',
  ACESSO_IMPEDIDO: 'Acesso impedido',
  SEM_RECURSO: 'Sem recurso compatível',
  SAIDA_PROPRIA_PENDENTE: 'Saída própria pendente',
}

export function formatarData(data: string | null): string {
  if (!data) {
    return 'Sem registro'
  }
  return new Date(data).toLocaleString('pt-BR')
}
