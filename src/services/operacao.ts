import { http } from '@/services/http'
import type { Veiculo, Destino } from '@/types/api'

export const getVeiculos = () => http<Veiculo[]>('/veiculos')
export const getDestinos = () => http<Destino[]>('/destinos')
