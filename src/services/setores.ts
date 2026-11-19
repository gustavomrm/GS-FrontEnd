import { http } from '@/services/http'
import type { Setor } from '@/types/api'

export function getSetores() {
  return http<Setor[]>('/setores')
}
