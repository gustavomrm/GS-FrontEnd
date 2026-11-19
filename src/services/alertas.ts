import { http } from '@/services/http'
import type { Alerta, Atendimento, Morador, NovoAlerta } from '@/types/api'

export function getAlertas(): Promise<Alerta[]> {
  return http<Alerta[]>('/alertas')
}

export function createAlerta(data: NovoAlerta): Promise<Alerta> {
  return http<Alerta>('/alertas', { method: 'POST', body: JSON.stringify(data) })
}

export function getAtendimentosDoAlerta(idAlerta: number): Promise<Atendimento[]> {
  return http<Atendimento[]>(`/alertas/${idAlerta}/atendimentos`)
}

export function getElegiveis(idAlerta: number): Promise<Morador[]> {
  return http<Morador[]>(`/alertas/${idAlerta}/elegiveis`)
}

export function incluirMorador(idAlerta: number, idMorador: number): Promise<Atendimento> {
  return http<Atendimento>(`/alertas/${idAlerta}/atendimentos`, {
    method: 'POST',
    body: JSON.stringify({ idMorador: idMorador }),
  })
}
