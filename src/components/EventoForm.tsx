import { useState, type FormEvent } from 'react'
import type { Atendimento, MotivoPendencia } from '@/types/api'
import { registrarMarco, type Marco } from '@/services/atendimentos'
import { FormField } from './FormField'
import { Feedback } from './Feedback'
import { estadoLabel, motivoLabel } from '@/utils/format'

export function EventoForm({ atendimento, onSaved }: { atendimento: Atendimento; onSaved: (a: Atendimento) => void }) {
  const opcoes: Marco[] = []
  if (atendimento.situacao === 'DESIGNADA') opcoes.push('EQUIPE_A_CAMINHO', 'EMBARCADA')
  if (atendimento.situacao === 'EQUIPE_A_CAMINHO') opcoes.push('EMBARCADA')
  if (atendimento.situacao === 'EMBARCADA') opcoes.push('CHEGADA_CONFIRMADA')
  opcoes.push('PENDENCIA')
  const [marco, setMarco] = useState<Marco>(opcoes[0])
  const [motivo, setMotivo] = useState<MotivoPendencia | ''>('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(event: FormEvent) {
    event.preventDefault()
    if (marco === 'PENDENCIA' && !motivo) return
    setEnviando(true)
    setErro('')
    try {
      onSaved(await registrarMarco(atendimento.id, marco, marco === 'PENDENCIA' && motivo ? motivo : undefined))
    } catch (e) {
      setErro((e as Error).message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="card flex flex-col gap-3" onSubmit={enviar}>
      <h2 className="font-display text-lg font-bold">Registrar andamento</h2>
      <FormField id="marco" label="Marco do atendimento">
        <select id="marco" className="input" value={marco} onChange={e => setMarco(e.target.value as Marco)}>
          {opcoes.map(m => <option key={m} value={m}>{m === 'PENDENCIA' ? 'Registrar pendência' : estadoLabel[m]}</option>)}
        </select>
      </FormField>
      {marco === 'PENDENCIA' && <FormField id="motivo" label="Motivo da pendência">
        <select id="motivo" className="input" required value={motivo} onChange={e => setMotivo(e.target.value as MotivoPendencia | '')}>
          <option value="">Selecione</option>
          {Object.entries(motivoLabel).map(([valor, rotulo]) => <option key={valor} value={valor}>{rotulo}</option>)}
        </select>
      </FormField>}
      {erro && <Feedback type="error" message={erro} />}
      <button className="btn-primary self-start" disabled={enviando}>Gravar registro</button>
    </form>
  )
}
