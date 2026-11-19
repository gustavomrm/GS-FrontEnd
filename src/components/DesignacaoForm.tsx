import { useState, type FormEvent } from 'react'
import { useApi } from '@/hooks/useApi'
import { getDestinos, getVeiculos } from '@/services/operacao'
import { designar } from '@/services/atendimentos'
import type { Atendimento } from '@/types/api'
import { StateMessage } from './StateMessage'
import { Feedback } from './Feedback'
import { FormField } from './FormField'

export function DesignacaoForm({ id, onSaved }: { id: number; onSaved: (a: Atendimento) => void }) {
  const recursos = useApi(() => Promise.all([getVeiculos(), getDestinos()]), [])
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const campos = new FormData(event.currentTarget)
    const responsavel = String(campos.get('responsavel')).trim()
    if (!responsavel) { setErro('Informe o responsável.'); return }
    setEnviando(true)
    setErro('')
    try {
      onSaved(await designar(id, { idVeiculo: Number(campos.get('veiculo')), idDestino: Number(campos.get('destino')), responsavel }))
    } catch (e) {
      setErro((e as Error).message)
    } finally {
      setEnviando(false)
    }
  }
  if (recursos.loading) return <StateMessage type="loading" message="Carregando veículos e destinos..." />
  if (recursos.error) return <StateMessage type="error" message={recursos.error} onRetry={recursos.reload} />
  const [veiculos, destinos] = recursos.data ?? [[], []]
  return (
    <form className="card flex flex-col gap-3" onSubmit={enviar}>
      <h2 className="font-display text-lg font-bold">Designar transporte</h2>
      <FormField label="Veículo" id="veiculo">
        <select className="input" id="veiculo" name="veiculo" required defaultValue="">
          <option value="">Selecione</option>
          {veiculos.filter(v => v.disponivel).map(v => <option key={v.id} value={v.id}>{v.nome} · {v.qtAssentos} assentos · {v.qtCadeiras} cadeiras · {v.qtMacas} macas</option>)}
        </select>
      </FormField>
      <FormField label="Destino" id="destino">
        <select className="input" id="destino" name="destino" required defaultValue="">
          <option value="">Selecione</option>
          {destinos.filter(d => d.disponivel).map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
        </select>
      </FormField>
      <FormField label="Responsável" id="responsavel">
        <input className="input" id="responsavel" name="responsavel" required maxLength={80} />
      </FormField>
      {erro && <Feedback type="error" message={erro} />}
      <button className="btn-primary self-start" disabled={enviando}>Confirmar designação</button>
    </form>
  )
}
