import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { StateMessage } from '@/components/StateMessage'
import { Feedback } from '@/components/Feedback'
import { AlertaForm } from '@/components/AlertaForm'
import { FilaAlerta } from '@/components/FilaAlerta'
import { VeiculosPanel } from '@/components/VeiculosPanel'
import { useSetores } from '@/hooks/useSetores'
import { getAlertas } from '@/services/alertas'
import type { Alerta } from '@/types/api'

export function OperacaoPage() {
  const { setores, loading: loadingSetores, error: errorSetores } = useSetores()
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [idAlerta, setIdAlerta] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    let active = true

    getAlertas()
      .then((data) => {
        if (active) {
          setAlertas(data)
          if (data.length > 0) setIdAlerta(data[0].id)
        }
      })
      .catch(() => {
        if (active) setError('Não foi possível carregar os alertas.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  function handleCreated(alerta: Alerta) {
    setAlertas((prev) => [alerta, ...prev])
    setIdAlerta(alerta.id)
    setMensagem(`Alerta #${alerta.id} aberto para ${alerta.setor.nome}.`)
  }

  const alertaAtual = alertas.find((alerta) => alerta.id === idAlerta)

  return (
    <div className="container-page flex flex-col gap-6">
      <PageHeader
        title="Painel de operação"
        description="Abra um alerta, inclua os moradores do setor na fila e acompanhe cada atendimento."
      />

      {errorSetores && <StateMessage type="error" message={errorSetores} />}
      {!errorSetores && loadingSetores && <StateMessage type="loading" message="Carregando setores..." />}
      {!errorSetores && !loadingSetores && <AlertaForm setores={setores} onCreated={handleCreated} />}
      {mensagem && <Feedback type="success" message={mensagem} />}

      {error && <StateMessage type="error" message={error} />}
      {!error && loading && <StateMessage type="loading" message="Carregando alertas..." />}
      {!error && !loading && alertas.length === 0 && <StateMessage type="empty" message="Nenhum alerta aberto ainda." />}

      {!error && !loading && alertaAtual && (
        <>
          <div className="flex flex-col gap-1">
            <label htmlFor="alerta-atual" className="text-sm font-semibold">
              Alerta acompanhado
            </label>
            <select
              id="alerta-atual"
              className="field"
              value={idAlerta}
              onChange={(event) => setIdAlerta(Number(event.target.value))}
            >
              {alertas.map((alerta) => (
                <option key={alerta.id} value={alerta.id}>
                  #{alerta.id} · {alerta.setor.nome} · {alerta.nivel} · {alerta.situacao}
                </option>
              ))}
            </select>
          </div>
          <FilaAlerta alerta={alertaAtual} />
        </>
      )}

      <VeiculosPanel />
    </div>
  )
}
