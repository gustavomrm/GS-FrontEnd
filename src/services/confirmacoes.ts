import { body, http } from '@/services/http'
import type { ConfirmacaoInput, Morador } from '@/types/api'

export function getConfirmacao(codigo: string) {
  return http<Morador>(`/confirmacoes/${encodeURIComponent(codigo)}`)
}

export function confirmarNecessidades(codigo: string, data: ConfirmacaoInput) {
  return http<Morador>(`/confirmacoes/${encodeURIComponent(codigo)}`, { method: 'PUT', ...body(data) })
}
