import { body, http } from '@/services/http'
import type { Morador, MoradorInput } from '@/types/api'

export function getMoradores() {
  return http<Morador[]>('/moradores')
}

export function getMoradorById(id: number) {
  return http<Morador>(`/moradores/${id}`)
}

export function createMorador(data: MoradorInput) {
  return http<Morador>('/moradores', { method: 'POST', ...body(data) })
}

export function updateMorador(id: number, data: MoradorInput) {
  return http<Morador>(`/moradores/${id}`, { method: 'PUT', ...body(data) })
}

export function deleteMorador(id: number) {
  return http<void>(`/moradores/${id}`, { method: 'DELETE' })
}
