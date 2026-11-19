import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { StateMessage } from '@/components/StateMessage'
import { FormField } from '@/components/FormField'
import { Feedback } from '@/components/Feedback'
import { confirmarDados, getConfirmacao } from '@/services/confirmacoes'
import { HttpError } from '@/services/http'
import type { Morador } from '@/types/api'
import { formatarData } from '@/utils/format'

interface ConfirmacaoForm {
  contato: string
  precisaMaca: boolean
  usaCadeiraRodas: boolean
  qtAcompanhante: string
  barreiraAcesso: string
}

type Status = 'idle' | 'success' | 'error'

export function ConfirmacaoPage() {
  const { codigo } = useParams<{ codigo: string }>()
  const [morador, setMorador] = useState<Morador | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [mensagem, setMensagem] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmacaoForm>()

  useEffect(() => {
    let active = true
    setLoading(true)
    setNotFound(false)

    getConfirmacao(String(codigo))
      .then((data) => {
        if (active) setMorador(data)
      })
      .catch(() => {
        if (active) setNotFound(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [codigo])

  async function onSubmit(data: ConfirmacaoForm) {
    setStatus('idle')
    try {
      const salvo = await confirmarDados(String(codigo), {
        contato: data.contato,
        precisaMaca: data.precisaMaca,
        usaCadeiraRodas: data.usaCadeiraRodas,
        qtAcompanhante: Number(data.qtAcompanhante),
        barreiraAcesso: data.barreiraAcesso,
      })
      setMorador(salvo)
      setStatus('success')
      setMensagem('Dados confirmados. Obrigado!')
    } catch (error) {
      setStatus('error')
      if (error instanceof HttpError) {
        setMensagem(error.message)
      } else {
        setMensagem('Não foi possível conectar à API.')
      }
    }
  }

  if (loading) {
    return (
      <div className="container-page">
        <StateMessage type="loading" message="Buscando cadastro..." />
      </div>
    )
  }

  if (notFound || !morador) {
    return (
      <div className="container-page flex max-w-md flex-col gap-4">
        <StateMessage type="error" message="Código não encontrado. Confira o código recebido." />
        <Link to="/confirmar" className="btn-secondary self-start">
          Digitar outro código
        </Link>
      </div>
    )
  }

  return (
    <div className="container-page">
      <PageHeader title="Confirmar necessidades" description="Revise os dados para que a equipe certa chegue no momento de uma evacuação." />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card flex max-w-2xl flex-col gap-4">
        <div>
          <h2 className="font-display text-xl font-bold">{morador.nome}</h2>
          <p className="text-sm text-slate-600">{morador.endereco}</p>
          <p className="text-sm text-slate-600">Última confirmação: {formatarData(morador.dataConfirmacao)}</p>
        </div>

        <FormField id="contato" label="Telefone para contato" error={errors.contato && errors.contato.message}>
          <input
            id="contato"
            type="tel"
            defaultValue={morador.contato ? morador.contato : ''}
            className="input"
            {...register('contato', {
              required: 'Informe um telefone.',
              pattern: { value: /^\(\d{2}\) \d{4,5}-\d{4}$/, message: 'Use o formato (11) 99999-0000.' },
            })}
          />
        </FormField>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Para sair de casa, a pessoa precisa de:</p>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked={morador.precisaMaca} {...register('precisaMaca')} /> Maca
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked={morador.usaCadeiraRodas} {...register('usaCadeiraRodas')} /> Cadeira de
            rodas
          </label>
        </div>

        <FormField
          id="qtAcompanhante"
          label="Quantos acompanhantes vão junto?"
          error={errors.qtAcompanhante && errors.qtAcompanhante.message}
        >
          <input
            id="qtAcompanhante"
            type="number"
            defaultValue={morador.qtAcompanhante}
            className="input sm:w-32"
            {...register('qtAcompanhante', {
              required: 'Informe 0 se ninguém for junto.',
              min: { value: 0, message: 'Não pode ser negativo.' },
            })}
          />
        </FormField>

        <FormField id="barreiraAcesso" label="Existe alguma barreira na saída?">
          <textarea
            id="barreiraAcesso"
            rows={3}
            defaultValue={morador.barreiraAcesso ? morador.barreiraAcesso : ''}
            className="input"
            {...register('barreiraAcesso')}
          />
        </FormField>

        {status === 'success' && <Feedback type="success" message={mensagem} />}
        {status === 'error' && <Feedback type="error" message={mensagem} />}

        <button type="submit" className="btn-primary self-start" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Confirmar dados'}
        </button>
      </form>
    </div>
  )
}
