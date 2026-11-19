import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { StateMessage } from '@/components/StateMessage'
import { useApi } from '@/hooks/useApi'
import { getAlertas } from '@/services/alertas'
import { listarAtendimentos } from '@/services/analises'
import { estadoLabel, motivoLabel } from '@/utils/format'

export function AnalisesPage() {
  const consulta = useApi(() => Promise.all([getAlertas(), listarAtendimentos()]), [])
  const [filtro, setFiltro] = useState('')
  const [alertas, atendimentos] = consulta.data ?? [[], []]
  const lista = atendimentos.filter(a => !filtro || a.alerta.id === Number(filtro))
  const pendentes = lista.filter(a => a.motivoPendencia)
  return (
    <div className="container-page flex flex-col gap-5">
      <PageHeader title="Resumo dos atendimentos" description="Consulte a situação dos atendimentos registrados na central, por alerta." />
      {consulta.loading ? <StateMessage type="loading" /> : consulta.error ?
        <StateMessage type="error" message={consulta.error} onRetry={consulta.reload} /> : <>
          <label htmlFor="alerta" className="font-semibold">Alerta</label>
          <select id="alerta" className="input" value={filtro} onChange={e => setFiltro(e.target.value)}>
            <option value="">Todos os alertas</option>
            {alertas.map(a => <option key={a.id} value={a.id}>#{a.id} · {a.setor.nome}</option>)}
          </select>
          {lista.length === 0 ? <StateMessage type="empty" message="Nenhum atendimento para o filtro selecionado." /> : <>
            <section className="card">
              <h2 className="font-display text-xl font-bold">Atendimentos por situação</h2>
              <p className="my-3">Total de atendimentos: {lista.length}</p>
              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(estadoLabel).map(([estado, nome]) => <div className="rounded-lg bg-slate-100 p-3" key={estado}>
                  <dt>{nome}</dt><dd className="text-xl font-bold">{lista.filter(a => a.situacao === estado).length}</dd>
                </div>)}
              </dl>
            </section>
            <section className="card">
              <h2 className="font-display text-xl font-bold">Atendimentos com pendência: {pendentes.length}</h2>
              {pendentes.length > 0 && <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                {Object.entries(motivoLabel).map(([motivo, nome]) => <div key={motivo}><dt>{nome}</dt><dd>{pendentes.filter(a => a.motivoPendencia === motivo).length}</dd></div>)}
              </dl>}
            </section>
          </>}
          <button className="btn-secondary self-start" onClick={consulta.reload}>Atualizar resumo</button>
        </>}
    </div>
  )
}
