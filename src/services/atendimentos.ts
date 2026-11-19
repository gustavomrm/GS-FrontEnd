import { body, http } from '@/services/http'
import type { Atendimento, MotivoPendencia } from '@/types/api'

export function getAtendimentoById(id: number) {
  return http<Atendimento>(`/atendimentos/${id}`)
}

export function designar(id: number, data: { idVeiculo: number; idDestino: number; responsavel: string }) {
  return http<Atendimento>(`/atendimentos/${id}/designacao`, { method: 'PUT', ...body(data) })
}

export type Marco = 'EQUIPE_A_CAMINHO' | 'EMBARCADA' | 'CHEGADA_CONFIRMADA' | 'PENDENCIA'

export function registrarMarco(id: number, marco: Marco, motivoPendencia?: MotivoPendencia) {
  return http<Atendimento>(`/atendimentos/${id}/marcos`, { method: 'PUT', ...body({ marco, motivoPendencia }) })
}
