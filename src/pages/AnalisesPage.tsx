import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { StateMessage } from '@/components/StateMessage'
import { getAlertas } from '@/services/alertas'
import { getAtendimentos } from '@/services/analises'
import type { Alerta, Atendimento } from '@/types/api'
import { motivos, nomeMotivo, nomeSituacao, situacoes } from '@/utils/format'

export function AnalisesPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [idAlerta, setIdAlerta] = useState(0)

  useEffect(() => {
    let active = true

    getAlertas()
      .then((data) => {
        if (active) setAlertas(data)
        return getAtendimentos()
      })
      .then((data) => {
        if (active) setAtendimentos(data)
      })
      .catch(() => {
        if (active) setError('Não foi possível carregar o resumo.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const lista = useMemo(
    () => atendimentos.filter((atendimento) => idAlerta === 0 || atendimento.alerta.id === idAlerta),
    [atendimentos, idAlerta],
  )

  const pendentes = lista.filter((atendimento) => atendimento.motivoPendencia !== null)

  return (
    <div className="container-page flex flex-col gap-5">
      <PageHeader title="Resumo dos atendimentos" description="Situação dos atendimentos registrados na central, por alerta." />

      {error && <StateMessage type="error" message={error} />}
      {!error && loading && <StateMessage type="loading" message="Carregando resumo..." />}

      {!error && !loading && (
        <>
          <div className="flex flex-col gap-1">
            <label htmlFor="alerta" className="text-sm font-semibold">
              Alerta
            </label>
            <select id="alerta" className="field sm:w-96" value={idAlerta} onChange={(event) => setIdAlerta(Number(event.target.value))}>
              <option value={0}>Todos os alertas</option>
              {alertas.map((alerta) => (
                <option key={alerta.id} value={alerta.id}>
                  #{alerta.id} · {alerta.setor.nome}
                </option>
              ))}
            </select>
          </div>

          {lista.length === 0 ? (
            <StateMessage type="empty" message="Nenhum atendimento para este alerta." />
          ) : (
            <>
              <section className="card">
                <h2 className="font-display text-xl font-bold">Atendimentos por situação</h2>
                <p className="mt-1 text-sm text-slate-600">Total: {lista.length}</p>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {situacoes.map((situacao) => (
                    <li key={situacao} className="rounded-lg bg-slate-100 p-3">
                      <p className="text-sm">{nomeSituacao[situacao]}</p>
                      <p className="text-2xl font-bold">{lista.filter((atendimento) => atendimento.situacao === situacao).length}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="card">
                <h2 className="font-display text-xl font-bold">Atendimentos com pendência: {pendentes.length}</h2>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {motivos.map((motivo) => (
                    <li key={motivo} className="rounded-lg bg-red-50 p-3">
                      <p className="text-sm">{nomeMotivo[motivo]}</p>
                      <p className="text-2xl font-bold">{pendentes.filter((atendimento) => atendimento.motivoPendencia === motivo).length}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </>
      )}
    </div>
  )
}
