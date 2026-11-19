import { http } from '@/services/http'
import type { Setor } from '@/types/api'

export function getSetores(): Promise<Setor[]> {
  return http<Setor[]>('/setores')
}
