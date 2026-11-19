import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { Alerta, Atendimento, Morador } from '@/types/api'
import { getAtendimentosDoAlerta, getElegiveis, incluirMorador } from '@/services/alertas'
import { HttpError } from '@/services/http'
import { AtendimentoCard } from '@/components/AtendimentoCard'
import { StateMessage } from '@/components/StateMessage'
import { Feedback } from '@/components/Feedback'
import { nomeSituacao, situacoes } from '@/utils/format'

interface FilaAlertaProps {
  alerta: Alerta
}

export function FilaAlerta({ alerta }: FilaAlertaProps) {
  const [fila, setFila] = useState<Atendimento[]>([])
  const [elegiveis, setElegiveis] = useState<Morador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [idMorador, setIdMorador] = useState('')
  const [filtro, setFiltro] = useState('TODAS')
  const [sending, setSending] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erroInclusao, setErroInclusao] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    getAtendimentosDoAlerta(alerta.id)
      .then((data) => {
        if (active) setFila(data)
        return getElegiveis(alerta.id)
      })
      .then((data) => {
        if (active) setElegiveis(data)
      })
      .catch(() => {
        if (active) setError('Não foi possível carregar a fila do alerta.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [alerta.id])

  const filtrados = useMemo(
    () => fila.filter((atendimento) => filtro === 'TODAS' || atendimento.situacao === filtro),
    [fila, filtro],
  )

  async function handleIncluir(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (idMorador === '') {
      setErroInclusao('Escolha um morador.')
      return
    }
    setSending(true)
    setMensagem('')
    setErroInclusao('')
    try {
      const novo = await incluirMorador(alerta.id, Number(idMorador))
      setFila((prev) => [...prev, novo])
      setElegiveis((prev) => prev.filter((morador) => morador.id !== novo.morador.id))
      setIdMorador('')
      setMensagem(`${novo.morador.nome} entrou na fila (atendimento #${novo.id}).`)
    } catch (error) {
      if (error instanceof HttpError) {
        setErroInclusao(error.message)
      } else {
        setErroInclusao('Não foi possível conectar à API.')
      }
    } finally {
      setSending(false)
    }
  }

  if (error) return <StateMessage type="error" message={error} />
  if (loading) return <StateMessage type="loading" message="Carregando fila do alerta..." />

  return (
    <section className="flex flex-col gap-4">
      {alerta.situacao === 'ABERTO' && (
        <form onSubmit={handleIncluir} className="card flex flex-col gap-3">
          <label htmlFor="morador" className="font-semibold">
            Incluir morador do setor na fila
          </label>
          {elegiveis.length === 0 ? (
            <p className="text-sm text-slate-600">Todos os moradores deste setor já estão na fila.</p>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <select id="morador" className="field" value={idMorador} onChange={(event) => setIdMorador(event.target.value)}>
                <option value="">Selecione um morador</option>
                {elegiveis.map((morador) => (
                  <option key={morador.id} value={morador.id}>
                    {morador.nome}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-primary shrink-0" disabled={sending}>
                {sending ? 'Incluindo...' : 'Incluir na fila'}
              </button>
            </div>
          )}
          {mensagem && <Feedback type="success" message={mensagem} />}
          {erroInclusao && <Feedback type="error" message={erroInclusao} />}
        </form>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-display text-xl font-bold">Fila do alerta #{alerta.id}</h2>
        <div className="flex flex-col gap-1">
          <label htmlFor="filtro" className="text-sm font-semibold">
            Filtrar por situação
          </label>
          <select id="filtro" className="field sm:w-64" value={filtro} onChange={(event) => setFiltro(event.target.value)}>
            <option value="TODAS">Todas</option>
            {situacoes.map((situacao) => (
              <option key={situacao} value={situacao}>
                {nomeSituacao[situacao]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <StateMessage type="empty" message="Nenhum atendimento para este filtro." />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((atendimento) => (
            <AtendimentoCard key={atendimento.id} atendimento={atendimento} />
          ))}
        </ul>
      )}
    </section>
  )
}
