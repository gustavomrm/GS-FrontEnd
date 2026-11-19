import { useState } from 'react'
import type { FormEvent } from 'react'
import { designarTransporte } from '@/services/atendimentos'
import { HttpError } from '@/services/http'
import { useVeiculos } from '@/hooks/useVeiculos'
import { useDestinos } from '@/hooks/useDestinos'
import type { Atendimento } from '@/types/api'
import { FormField } from '@/components/FormField'
import { Feedback } from '@/components/Feedback'
import { StateMessage } from '@/components/StateMessage'

interface DesignacaoFormProps {
  idAtendimento: number
  onSaved: (atendimento: Atendimento) => void
}

export function DesignacaoForm({ idAtendimento, onSaved }: DesignacaoFormProps) {
  const veiculos = useVeiculos()
  const destinos = useDestinos()
  const [sending, setSending] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const idVeiculo = Number(formData.get('veiculo'))
    const idDestino = Number(formData.get('destino'))
    const responsavel = String(formData.get('responsavel')).trim()

    if (idVeiculo === 0 || idDestino === 0) {
      setErro('Escolha o veículo e o destino.')
      return
    }
    if (responsavel.length < 3) {
      setErro('Informe o responsável com ao menos 3 letras.')
      return
    }

    setSending(true)
    setErro('')
    try {
      const atualizado = await designarTransporte(idAtendimento, { idVeiculo, idDestino, responsavel })
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

  if (veiculos.error || destinos.error) {
    return <StateMessage type="error" message="Não foi possível carregar veículos e destinos." />
  }
  if (veiculos.loading || destinos.loading) {
    return <StateMessage type="loading" message="Carregando veículos e destinos..." />
  }

  const veiculosLivres = veiculos.veiculos.filter((veiculo) => veiculo.disponivel)
  const destinosLivres = destinos.destinos.filter((destino) => destino.disponivel)

  return (
    <form onSubmit={handleSubmit} noValidate className="card flex flex-col gap-4">
      <h2 className="font-display text-lg font-bold">Designar transporte</h2>
      <FormField id="veiculo" label="Veículo">
        <select id="veiculo" name="veiculo" className="field">
          <option value="">Selecione</option>
          {veiculosLivres.map((veiculo) => (
            <option key={veiculo.id} value={veiculo.id}>
              {veiculo.nome} · {veiculo.qtAssentos} assentos · {veiculo.qtCadeiras} cadeiras · {veiculo.qtMacas} macas
            </option>
          ))}
        </select>
      </FormField>
      <FormField id="destino" label="Destino">
        <select id="destino" name="destino" className="field">
          <option value="">Selecione</option>
          {destinosLivres.map((destino) => (
            <option key={destino.id} value={destino.id}>
              {destino.nome} {destino.acessivel ? '(acessível)' : ''}
            </option>
          ))}
        </select>
      </FormField>
      <FormField id="responsavel" label="Responsável">
        <input id="responsavel" name="responsavel" className="field" />
      </FormField>
      {erro && <Feedback type="error" message={erro} />}
      <button type="submit" className="btn-primary self-start" disabled={sending}>
        {sending ? 'Salvando...' : 'Confirmar designação'}
      </button>
    </form>
  )
}
