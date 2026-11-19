import { http } from '@/services/http'
import type { Atendimento } from '@/types/api'

export function listarAtendimentos() {
  return http<Atendimento[]>('/atendimentos')
}
