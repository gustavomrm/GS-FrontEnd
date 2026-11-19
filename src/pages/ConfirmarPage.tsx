import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { StateMessage } from '@/components/StateMessage'
import { FormField } from '@/components/FormField'
import { Feedback } from '@/components/Feedback'
import { useApi } from '@/hooks/useApi'
import { confirmarNecessidades, getConfirmacao } from '@/services/confirmacoes'
import type { Morador } from '@/types/api'
import { formatDateTime } from '@/utils/format'

interface CodigoValues {
  codigo: string
}

function BuscarCodigo() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CodigoValues>()

  return (
    <form
      onSubmit={handleSubmit((v) => navigate(`/confirmar/${encodeURIComponent(v.codigo.trim())}`))}
      noValidate
      className="card flex max-w-md flex-col gap-4"
    >
      <FormField id="codigo" label="Código de confirmação" error={errors.codigo?.message} hint="Código entregue pelo agente da Defesa Civil.">
        <input
          id="codigo"
          className="input"
          autoComplete="off"
          aria-invalid={!!errors.codigo}
          {...register('codigo', {
            required: 'Digite o código.',
            validate: (v) => (v.trim().length >= 4 && v.trim().length <= 12) || 'Informe o código de 4 a 12 caracteres.',
          })}
        />
      </FormField>
      <button type="submit" className="btn-primary self-start">
        Continuar
      </button>
    </form>
  )
}

interface ConfirmacaoValues {
  contato: string
  precisaMaca: boolean
  usaCadeiraRodas: boolean
  qtAcompanhante: string
  barreiraAcesso: string
  concordo: boolean
}

function FormConfirmacao({ codigo, morador }: { codigo: string; morador: Morador }) {
  const [atual, setAtual] = useState(morador)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmacaoValues>({
    defaultValues: {
      contato: morador.contato ?? '',
      precisaMaca: morador.precisaMaca,
      usaCadeiraRodas: morador.usaCadeiraRodas,
      qtAcompanhante: String(morador.qtAcompanhante),
      barreiraAcesso: morador.barreiraAcesso ?? '',
      concordo: false,
    },
  })

  async function onSubmit(values: ConfirmacaoValues) {
    setFeedback(null)
    try {
      const salvo = await confirmarNecessidades(codigo, {
        contato: values.contato.trim() || null,
        precisaMaca: values.precisaMaca,
        usaCadeiraRodas: values.usaCadeiraRodas,
        qtAcompanhante: Number(values.qtAcompanhante),
        barreiraAcesso: values.barreiraAcesso.trim() || null,
      })
      setAtual(salvo)
      setFeedback({ type: 'success', message: `Dados confirmados em ${formatDateTime(salvo.dataConfirmacao)}. Obrigado!` })
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card flex max-w-2xl flex-col gap-4">
      <div>
        <h2 className="font-display text-xl font-bold">{atual.nome}</h2>
        <p className="text-sm text-slate-600">
          {atual.endereco} · Última confirmação: {formatDateTime(atual.dataConfirmacao)}
        </p>
      </div>

      <FormField id="contato" label="Contato (opcional)">
        <input id="contato" maxLength={30} className="input" {...register('contato')} />
      </FormField>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-semibold">Para sair de casa, a pessoa precisa de:</legend>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('precisaMaca')} /> Maca
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('usaCadeiraRodas')} /> Cadeira de rodas
        </label>
      </fieldset>

      <FormField id="qtAcompanhante" label="Quantos acompanhantes vão junto?" error={errors.qtAcompanhante?.message}>
        <input
          id="qtAcompanhante"
          type="number"
          min={0}
          max={5}
          className="input sm:w-32"
          aria-invalid={!!errors.qtAcompanhante}
          {...register('qtAcompanhante', {
            required: 'Informe 0 se ninguém for junto.',
            min: { value: 0, message: 'Não pode ser negativo.' },
            max: { value: 5, message: 'No máximo 5 acompanhantes.' },
            validate: (v) => Number.isInteger(Number(v)) || 'Informe um número inteiro.',
          })}
        />
      </FormField>

      <FormField id="barreiraAcesso" label="Existe alguma barreira na saída?" hint="Ex.: escada na entrada, corredor estreito">
        <textarea id="barreiraAcesso" rows={3} maxLength={200} className="input" {...register('barreiraAcesso')} />
      </FormField>

      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" className="mt-1" aria-invalid={!!errors.concordo} {...register('concordo', { required: 'Marque para confirmar.' })} />
        Confirmo que as informações estão corretas.
      </label>
      {errors.concordo && <p className="text-xs font-semibold text-red-700">{errors.concordo.message}</p>}

      {feedback && <Feedback type={feedback.type} message={feedback.message} />}

      <button type="submit" className="btn-primary self-start" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Confirmar dados'}
      </button>
    </form>
  )
}

function ConsultaPorCodigo({ codigo }: { codigo: string }) {
  const morador = useApi(() => getConfirmacao(codigo), [codigo])
  if (morador.loading) return <StateMessage type="loading" message="Buscando cadastro..." />
  if (morador.error) {
    return (
      <div className="flex max-w-md flex-col gap-4">
        <StateMessage type="error" message={morador.error} onRetry={morador.reload} />
        <BuscarCodigo />
      </div>
    )
  }
  return morador.data && <FormConfirmacao codigo={codigo} morador={morador.data} />
}

export function ConfirmarPage() {
  const { codigo } = useParams<{ codigo: string }>()
  return (
    <div className="container-page">
      <PageHeader
        title="Confirmar necessidades"
        description="Morador ou cuidador: revise os dados para que a equipe certa chegue no momento de uma evacuação."
      />
      {codigo ? <ConsultaPorCodigo key={codigo} codigo={codigo} /> : <BuscarCodigo />}
    </div>
  )
}
