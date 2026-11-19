import { body, http } from '@/services/http'
import type { Alerta, Atendimento, MoradorDaFila } from '@/types/api'

export function getAlertas() {
  return http<Alerta[]>('/alertas')
}

export function createAlerta(data: { idSetor: number; nivel: string }) {
  return http<Alerta>('/alertas', { method: 'POST', ...body(data) })
}

export function getAtendimentosDoAlerta(idAlerta: number) {
  return http<Atendimento[]>(`/alertas/${idAlerta}/atendimentos`)
}

export function getElegiveis(id: number) {
  return http<MoradorDaFila[]>(`/alertas/${id}/elegiveis`)
}

export function incluirMorador(id: number, idMorador: number) {
  return http<Atendimento>(`/alertas/${id}/atendimentos`, { method: 'POST', ...body({ idMorador }) })
}
