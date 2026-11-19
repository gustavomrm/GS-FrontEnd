import { useState } from 'react'
import type { FormEvent } from 'react'
import { registrarMarco } from '@/services/atendimentos'
import { HttpError } from '@/services/http'
import type { Atendimento, Marco, MotivoPendencia, SituacaoAtendimento } from '@/types/api'
import { FormField } from '@/components/FormField'
import { Feedback } from '@/components/Feedback'
import { motivos, nomeMotivo, nomeSituacao } from '@/utils/format'

interface EventoFormProps {
  atendimento: Atendimento
  onSaved: (atendimento: Atendimento) => void
}

function proximosMarcos(situacao: SituacaoAtendimento): Marco[] {
  if (situacao === 'DESIGNADA') return ['EQUIPE_A_CAMINHO', 'EMBARCADA', 'PENDENCIA']
  if (situacao === 'EQUIPE_A_CAMINHO') return ['EMBARCADA', 'PENDENCIA']
  if (situacao === 'EMBARCADA') return ['CHEGADA_CONFIRMADA', 'PENDENCIA']
  return ['PENDENCIA']
}

function nomeDoMarco(marco: Marco): string {
  if (marco === 'PENDENCIA') return 'Registrar pendência'
  return nomeSituacao[marco]
}

export function EventoForm({ atendimento, onSaved }: EventoFormProps) {
  const opcoes = proximosMarcos(atendimento.situacao)
  const [marco, setMarco] = useState<Marco>(opcoes[0])
  const [motivo, setMotivo] = useState('')
  const [sending, setSending] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (marco === 'PENDENCIA' && motivo === '') {
      setErro('Escolha o motivo da pendência.')
      return
    }

    setSending(true)
    setErro('')
    try {
      const atualizado = await registrarMarco(atendimento.id, {
        marco: marco,
        motivoPendencia: marco === 'PENDENCIA' ? (motivo as MotivoPendencia) : null,
      })
      setMotivo('')
      setMarco(proximosMarcos(atualizado.situacao)[0])
      onSaved(atualizado)
    } catch (error) {
      if (error instanceof HttpError) {
        setErro(error.message)
      } else {
        setErro('Não foi possível conectar à API.')
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card flex flex-col gap-4">
      <h2 className="font-display text-lg font-bold">Registrar andamento</h2>
      <FormField id="marco" label="O que aconteceu?">
        <select id="marco" className="input" value={marco} onChange={(event) => setMarco(event.target.value as Marco)}>
          {opcoes.map((opcao) => (
            <option key={opcao} value={opcao}>
              {nomeDoMarco(opcao)}
            </option>
          ))}
        </select>
      </FormField>
      {marco === 'PENDENCIA' && (
        <FormField id="motivo" label="Motivo da pendência">
          <select id="motivo" className="input" value={motivo} onChange={(event) => setMotivo(event.target.value)}>
            <option value="">Selecione</option>
            {motivos.map((item) => (
              <option key={item} value={item}>
                {nomeMotivo[item]}
              </option>
            ))}
          </select>
        </FormField>
      )}
      {erro && <Feedback type="error" message={erro} />}
      <button type="submit" className="btn-primary self-start" disabled={sending}>
        {sending ? 'Gravando...' : 'Gravar registro'}
      </button>
    </form>
  )
}
