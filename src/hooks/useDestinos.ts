import { useEffect, useState } from 'react'
import { getDestinos } from '@/services/operacao'
import type { Destino } from '@/types/api'

export function useDestinos() {
  const [destinos, setDestinos] = useState<Destino[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    getDestinos()
      .then((data) => {
        if (active) setDestinos(data)
      })
      .catch(() => {
        if (active) setError('Não foi possível carregar os destinos.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { destinos, loading, error }
}
