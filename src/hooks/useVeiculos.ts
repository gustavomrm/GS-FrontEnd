import { useEffect, useState } from 'react'
import { getVeiculos } from '@/services/operacao'
import type { Veiculo } from '@/types/api'

export function useVeiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    getVeiculos()
      .then((data) => {
        if (active) setVeiculos(data)
      })
      .catch(() => {
        if (active) setError('Não foi possível carregar os veículos.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { veiculos, loading, error }
}
