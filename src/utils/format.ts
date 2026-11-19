import type { EstadoAtendimento, Morador, MotivoPendencia } from '@/types/api'

const dataHora = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
})

export function formatDateTime(iso: string | null) {
  if (!iso) return 'Sem registro'
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? iso : dataHora.format(date)
}

export const estadoLabel: Record<EstadoAtendimento, string> = {
  RECUSADO: 'Recusado',
  AGUARDANDO: 'Aguardando',
  DESIGNADA: 'Viagem designada',
  EQUIPE_A_CAMINHO: 'Equipe a caminho',
  EMBARCADA: 'Embarcada',
  CHEGADA_CONFIRMADA: 'Chegada confirmada',
}

export const motivoLabel: Record<MotivoPendencia, string> = {
  SEM_CONTATO: 'Sem contato',
  ACESSO_IMPEDIDO: 'Acesso impedido',
  SEM_RECURSO: 'Sem recurso compatível',
  SAIDA_PROPRIA_PENDENTE: 'Saída própria pendente',
}

export const proximoEstado: Partial<Record<EstadoAtendimento, EstadoAtendimento>> = {
  DESIGNADA: 'EQUIPE_A_CAMINHO',
  EQUIPE_A_CAMINHO: 'EMBARCADA',
  EMBARCADA: 'CHEGADA_CONFIRMADA',
}

export function necessidades(morador: Pick<Morador, 'precisaMaca' | 'precisaCadeira' | 'qtAcompanhante'>) {
  const lista: string[] = []
  if (morador.precisaMaca) lista.push('Maca')
  if (morador.precisaCadeira) lista.push('Cadeira de rodas')
  if (morador.qtAcompanhante > 0) {
    lista.push(`${morador.qtAcompanhante} acompanhante${morador.qtAcompanhante > 1 ? 's' : ''}`)
  }
  if (lista.length === 0) lista.push('Assento comum')
  return lista
}

export function novoIdEvento() {
  return crypto.randomUUID()
}
