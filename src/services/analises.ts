import { http } from '@/services/http'
import type { Atendimento } from '@/types/api'

export function getAtendimentos(): Promise<Atendimento[]> {
  return http<Atendimento[]>('/atendimentos')
}
