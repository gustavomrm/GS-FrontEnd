import { useState, type FormEvent } from 'react'
import type { Alerta } from '@/types/api'
import { getAtendimentosDoAlerta, getElegiveis, incluirMorador } from '@/services/alertas'
import { useApi } from '@/hooks/useApi'
import { AtendimentoCard } from './AtendimentoCard'
import { StateMessage } from './StateMessage'
import { Feedback } from './Feedback'
import { estadoLabel } from '@/utils/format'

export function FilaAlerta({ alerta }: { alerta: Alerta }) {
  const fila = useApi(() => getAtendimentosDoAlerta(alerta.id), [alerta.id])
  const aberto = alerta.situacao === 'ABERTO'
  const elegiveis = useApi(() => aberto ? getElegiveis(alerta.id) : Promise.resolve([]), [alerta.id, aberto])
  const [morador, setMorador] = useState('')
  const [filtro, setFiltro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [aviso, setAviso] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  async function incluir(event: FormEvent) {
    event.preventDefault()
    if (!morador || enviando) return
    setEnviando(true)
    setAviso(null)
    try {
      const novo = await incluirMorador(alerta.id, Number(morador))
      setAviso({ type: 'success', message: `Atendimento #${novo.id} criado para ${novo.morador.nome}.` })
      setMorador('')
      fila.reload()
      elegiveis.reload()
    } catch (erro) {
      setAviso({ type: 'error', message: (erro as Error).message })
      elegiveis.reload()
    } finally {
      setEnviando(false)
    }
  }

  const filtrados = (fila.data ?? []).filter(a =>
    filtro === '' || (filtro === 'PENDENCIA' ? Boolean(a.motivoPendencia) : a.situacao === filtro))
  return (
    <section className="flex flex-col gap-4">
      {aberto && <form className="card flex flex-col gap-3" onSubmit={incluir}>
        <label htmlFor="elegivel" className="font-semibold">Incluir morador no alerta</label>
        {elegiveis.loading ? <StateMessage type="loading" /> : elegiveis.error ?
          <StateMessage type="error" message={elegiveis.error} onRetry={elegiveis.reload} /> :
          elegiveis.data?.length ? <>
            <select className="input" id="elegivel" required value={morador} onChange={e => setMorador(e.target.value)}>
              <option value="">Selecione um morador</option>
              {elegiveis.data.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </select>
            <button className="btn-primary self-start" disabled={enviando || !morador}>Incluir na fila</button>
          </> : <p>Nenhum morador elegível neste setor.</p>}
        {aviso && <Feedback {...aviso} />}
      </form>}
      <h2 className="font-display text-xl font-bold">Fila do alerta #{alerta.id}</h2>
      <label htmlFor="filtro">Filtrar por situação</label>
      <select id="filtro" className="input sm:w-72" value={filtro} onChange={e => setFiltro(e.target.value)}>
        <option value="">Todas</option><option value="PENDENCIA">Com pendência</option>
        {Object.entries(estadoLabel).map(([valor, nome]) => <option key={valor} value={valor}>{nome}</option>)}
      </select>
      {fila.loading ? <StateMessage type="loading" /> : fila.error ?
        <StateMessage type="error" message={fila.error} onRetry={fila.reload} /> :
        filtrados.length ? <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtrados.map(a => <AtendimentoCard key={a.id} atendimento={a} />)}
        </ul> : <StateMessage type="empty" message="Nenhum atendimento para este filtro." />}
    </section>
  )
}
