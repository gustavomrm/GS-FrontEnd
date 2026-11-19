import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApi } from '@/hooks/useApi'
import { getAtendimentoById } from '@/services/atendimentos'
import { StateMessage } from '@/components/StateMessage'
import { StatusBadge } from '@/components/StatusBadge'
import { DesignacaoForm } from '@/components/DesignacaoForm'
import { EventoForm } from '@/components/EventoForm'
import { Feedback } from '@/components/Feedback'
import { formatDateTime } from '@/utils/format'
import type { Atendimento } from '@/types/api'

export function AtendimentoPage() {
  const id = Number(useParams().id)
  return <div className="container-page flex flex-col gap-5">
    <Link className="btn-secondary self-start" to="/operacao">Voltar ao painel</Link>
    {Number.isSafeInteger(id) && id > 0 ? <Ficha key={id} id={id} /> : <StateMessage type="error" message="Número de atendimento inválido." />}
  </div>
}

function Ficha({ id }: { id: number }) {
  const consulta = useApi(() => getAtendimentoById(id), [id])
  const [salvo, setSalvo] = useState<Atendimento | null>(null)
  if (consulta.loading) return <StateMessage type="loading" />
  if (consulta.error || !consulta.data) return <StateMessage type="error" message={consulta.error ?? 'Atendimento não encontrado.'} onRetry={consulta.reload} />
  const a = salvo ?? consulta.data
  const m = a.morador
  const encerrado = a.situacao === 'CHEGADA_CONFIRMADA' || a.situacao === 'RECUSADO'

  return <>
    <header>
      <p>Atendimento #{a.id} · Alerta #{a.alerta.id}</p>
      <h1 className="font-display text-3xl font-bold">{m.nome}</h1>
      <StatusBadge estado={a.situacao} motivo={a.motivoPendencia} />
    </header>
    <section className="card">
      <h2 className="font-display text-lg font-bold">Dados do atendimento</h2>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        {Object.entries({
          'Endereço': m.endereco, 'Contato': m.contato || 'Não informado',
          'Precisa de maca': m.precisaMaca ? 'Sim' : 'Não', 'Usa cadeira de rodas': m.usaCadeiraRodas ? 'Sim' : 'Não',
          'Acompanhantes': m.qtAcompanhante, 'Barreira de acesso': m.barreiraAcesso || 'Nenhuma informada',
          'Veículo': a.veiculo?.nome ?? 'Aguardando designação', 'Destino': a.destino?.nome ?? 'Aguardando designação',
          'Responsável': a.responsavel ?? 'Ainda não designado',
        }).map(([rotulo, valor]) => <div key={rotulo}><dt className="font-semibold">{rotulo}</dt><dd>{valor}</dd></div>)}
      </dl>
    </section>
    {salvo && <Feedback type="success" message="Registro atualizado na central." />}
    {a.situacao === 'AGUARDANDO' && <DesignacaoForm id={a.id} onSaved={setSalvo} />}
    {!encerrado && <EventoForm key={a.situacao} atendimento={a} onSaved={setSalvo} />}
    <section className="card">
      <h2 className="font-display text-lg font-bold">Horários registrados</h2>
      <dl className="mt-3 grid gap-3 sm:grid-cols-3">
        {Object.entries({ 'Designação': a.dataDesignacao, 'Embarque': a.dataEmbarque, 'Chegada': a.dataChegada }).map(([rotulo, data]) =>
          <div key={rotulo}><dt className="font-semibold">{rotulo}</dt><dd>{formatDateTime(data)}</dd></div>)}
      </dl>
    </section>
  </>
}
