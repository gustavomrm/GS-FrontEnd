import { http } from '@/services/http'
import type { Setor } from '@/types/api'

export async function getSetores(): Promise<Setor[]> {
  const setores = await http<{ id: number; nome: string; nivelRisco: string }[]>('/setores')
  return setores.map(({ id, nome, nivelRisco }) => ({ idSetor: id, nome, nivelRisco }))
}
