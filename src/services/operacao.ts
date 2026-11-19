import { http } from '@/services/http'
import type { Destino, Veiculo } from '@/types/api'

export function getVeiculos(): Promise<Veiculo[]> {
  return http<Veiculo[]>('/veiculos')
}

export function getDestinos(): Promise<Destino[]> {
  return http<Destino[]>('/destinos')
}
