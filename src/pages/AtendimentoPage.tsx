import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getAtendimento } from '@/services/atendimentos'
import { HttpError } from '@/services/http'
import type { Atendimento } from '@/types/api'
import { StateMessage } from '@/components/StateMessage'
import { StatusBadge } from '@/components/StatusBadge'
import { Necessidades } from '@/components/Necessidades'
import { DesignacaoForm } from '@/components/DesignacaoForm'
import { EventoForm } from '@/components/EventoForm'
import { Feedback } from '@/components/Feedback'
import { formatarData } from '@/utils/format'

export function AtendimentoPage() {
  const { id } = useParams<{ id: string }>()
  const [atendimento, setAtendimento] = useState<Atendimento | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState('')
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setNotFound(false)
    setError('')

    getAtendimento(Number(id))
      .then((data) => {
        if (active) setAtendimento(data)
      })
      .catch((erro) => {
        if (!active) return
        if (erro instanceof HttpError && (erro.status === 404 || erro.status === 400)) {
          setNotFound(true)
        } else {
          setError('Não foi possível carregar o atendimento.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  function handleSaved(atualizado: Atendimento) {
    setAtendimento(atualizado)
    setMensagem('Registro gravado na central.')
  }

  if (loading) {
    return (
      <div className="container-page">
        <StateMessage type="loading" message="Carregando atendimento..." />
      </div>
    )
  }

  if (error || notFound || !atendimento) {
    return (
      <div className="container-page flex flex-col gap-4">
        <StateMessage type="error" message={error ? error : 'Atendimento não encontrado.'} />
        <Link to="/operacao" className="btn-secondary self-start">
          Voltar ao painel
        </Link>
      </div>
    )
  }

  const encerrado = atendimento.situacao === 'CHEGADA_CONFIRMADA' || atendimento.situacao === 'RECUSADO'

  return (
    <div className="container-page flex flex-col gap-5">
      <Link to="/operacao" className="btn-secondary self-start">
        Voltar ao painel
      </Link>

      <header className="flex flex-col gap-2">
        <p className="text-sm text-slate-600">
          Atendimento #{atendimento.id} · Alerta #{atendimento.alerta.id} · {atendimento.alerta.setor.nome}
        </p>
        <h1 className="font-display text-3xl font-bold">{atendimento.morador.nome}</h1>
        <StatusBadge situacao={atendimento.situacao} motivo={atendimento.motivoPendencia} />
      </header>

      <section className="card grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <p className="font-semibold">Endereço</p>
          <p>{atendimento.morador.endereco}</p>
        </div>
        <div>
          <p className="font-semibold">Contato</p>
          <p>{atendimento.morador.contato ? atendimento.morador.contato : 'Não informado'}</p>
        </div>
        <div>
          <p className="font-semibold">Necessidades</p>
          <Necessidades morador={atendimento.morador} />
        </div>
        <div>
          <p className="font-semibold">Barreira de acesso</p>
          <p>{atendimento.morador.barreiraAcesso ? atendimento.morador.barreiraAcesso : 'Nenhuma informada'}</p>
        </div>
        <div>
          <p className="font-semibold">Veículo</p>
          <p>{atendimento.veiculo ? atendimento.veiculo.nome : 'Aguardando designação'}</p>
        </div>
        <div>
          <p className="font-semibold">Destino</p>
          <p>{atendimento.destino ? atendimento.destino.nome : 'Aguardando designação'}</p>
        </div>
        <div>
          <p className="font-semibold">Responsável</p>
          <p>{atendimento.responsavel ? atendimento.responsavel : 'Ainda não designado'}</p>
        </div>
      </section>

      {mensagem && <Feedback type="success" message={mensagem} />}
      {atendimento.situacao === 'AGUARDANDO' && <DesignacaoForm idAtendimento={atendimento.id} onSaved={handleSaved} />}
      {!encerrado && <EventoForm atendimento={atendimento} onSaved={handleSaved} />}

      <section className="card grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <p className="font-semibold">Designação</p>
          <p>{formatarData(atendimento.dataDesignacao)}</p>
        </div>
        <div>
          <p className="font-semibold">Embarque</p>
          <p>{formatarData(atendimento.dataEmbarque)}</p>
        </div>
        <div>
          <p className="font-semibold">Chegada</p>
          <p>{formatarData(atendimento.dataChegada)}</p>
        </div>
      </section>
    </div>
  )
}
