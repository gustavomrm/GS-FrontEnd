import { http } from '@/services/http'
import type { Morador, NovoMorador } from '@/types/api'

export function getMoradores(): Promise<Morador[]> {
  return http<Morador[]>('/moradores')
}

export function createMorador(data: NovoMorador): Promise<Morador> {
  return http<Morador>('/moradores', { method: 'POST', body: JSON.stringify(data) })
}

export function deleteMorador(id: number): Promise<null> {
  return http<null>(`/moradores/${id}`, { method: 'DELETE' })
}
