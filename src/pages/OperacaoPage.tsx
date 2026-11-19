import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { StateMessage } from '@/components/StateMessage'
import { AlertaForm } from '@/components/AlertaForm'
import { FilaAlerta } from '@/components/FilaAlerta'
import { VeiculosPanel } from '@/components/VeiculosPanel'
import { useApi } from '@/hooks/useApi'
import { getAlertas } from '@/services/alertas'
import { getSetores } from '@/services/setores'
import { getVeiculos } from '@/services/operacao'

export function OperacaoPage() {
  const alertas = useApi(getAlertas, [])
  const setores = useApi(getSetores, [])
  const veiculos = useApi(getVeiculos, [])
  const [id, escolher] = useState<number | null>(null)
  const lista = alertas.data ?? []
  const atual = lista.find(a => a.id === id) ?? lista.find(a => a.situacao === 'ABERTO') ?? lista[0]

  return (
    <div className="container-page flex flex-col gap-6">
      <PageHeader title="Painel de operação" description="Abra um alerta, inclua moradores do setor e acompanhe a fila de atendimento." />
      {setores.loading ? <StateMessage type="loading" message="Carregando setores..." /> : setores.error ?
        <StateMessage type="error" message={setores.error} onRetry={setores.reload} /> :
        <AlertaForm setores={setores.data ?? []} onCreated={a => { escolher(a.id); alertas.reload() }} />}
      {alertas.loading ? <StateMessage type="loading" /> : alertas.error ?
        <StateMessage type="error" message={alertas.error} onRetry={alertas.reload} /> : atual ? <>
          <label htmlFor="alerta-atual" className="font-semibold">Alerta acompanhado</label>
          <select id="alerta-atual" className="input" value={atual.id} onChange={e => escolher(Number(e.target.value))}>
            {lista.map(a => <option key={a.id} value={a.id}>#{a.id} · {a.setor.nome} · {a.nivel} · {a.situacao}</option>)}
          </select>
          <FilaAlerta key={atual.id} alerta={atual} />
        </> : <StateMessage type="empty" message="Nenhum alerta cadastrado." />}
      {veiculos.loading ? <StateMessage type="loading" message="Carregando veículos..." /> : veiculos.error ?
        <StateMessage type="error" message={veiculos.error} onRetry={veiculos.reload} /> :
        veiculos.data?.length ? <VeiculosPanel veiculos={veiculos.data} /> : <StateMessage type="empty" message="Nenhum veículo cadastrado." />}
    </div>
  )
}
