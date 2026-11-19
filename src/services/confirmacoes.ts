import { http } from '@/services/http'
import type { Confirmacao, Morador } from '@/types/api'

export function getConfirmacao(codigo: string): Promise<Morador> {
  return http<Morador>(`/confirmacoes/${codigo}`)
}

export function confirmarDados(codigo: string, data: Confirmacao): Promise<Morador> {
  return http<Morador>(`/confirmacoes/${codigo}`, { method: 'PUT', body: JSON.stringify(data) })
}
