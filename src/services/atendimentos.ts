import { http } from '@/services/http'
import type { Atendimento, Designacao, RegistroMarco } from '@/types/api'

export function getAtendimento(id: number): Promise<Atendimento> {
  return http<Atendimento>(`/atendimentos/${id}`)
}

export function designarTransporte(id: number, data: Designacao): Promise<Atendimento> {
  return http<Atendimento>(`/atendimentos/${id}/designacao`, { method: 'PUT', body: JSON.stringify(data) })
}

export function registrarMarco(id: number, data: RegistroMarco): Promise<Atendimento> {
  return http<Atendimento>(`/atendimentos/${id}/marcos`, { method: 'PUT', body: JSON.stringify(data) })
}
