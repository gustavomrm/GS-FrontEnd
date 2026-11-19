import { useEffect, useState } from 'react'
import { getSetores } from '@/services/setores'
import type { Setor } from '@/types/api'

export function useSetores() {
  const [setores, setSetores] = useState<Setor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    getSetores()
      .then((data) => {
        if (active) setSetores(data)
      })
      .catch(() => {
        if (active) setError('Não foi possível carregar os setores.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { setores, loading, error }
}
