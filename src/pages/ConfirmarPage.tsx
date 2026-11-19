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
      onSubmit={handleSubmit((v) => navigate(`/confirmar/${v.codigo.trim().toUpperCase()}`))}
      noValidate
      className="card flex max-w-md flex-col gap-4"
    >
      <FormField id="codigo" label="Código de confirmação" error={errors.codigo?.message} hint="Código entregue pelo agente da Defesa Civil.">
        <input
          id="codigo"
          className="input uppercase"
          autoComplete="off"
          aria-invalid={!!errors.codigo}
          {...register('codigo', {
            required: 'Digite o código.',
            pattern: { value: /^[A-Za-z0-9-]{4,12}$/, message: 'O código tem de 4 a 12 letras ou números.' },
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
  precisaMaca: boolean
  precisaCadeira: boolean
  qtAcompanhante: string
  observacaoAcesso: string
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
      precisaMaca: morador.precisaMaca,
      precisaCadeira: morador.precisaCadeira,
      qtAcompanhante: String(morador.qtAcompanhante),
      observacaoAcesso: morador.observacaoAcesso ?? '',
      concordo: false,
    },
  })

  async function onSubmit(values: ConfirmacaoValues) {
    setFeedback(null)
    try {
      const salvo = await confirmarNecessidades(codigo, {
        precisaMaca: values.precisaMaca,
        precisaCadeira: values.precisaCadeira,
        qtAcompanhante: Number(values.qtAcompanhante),
        observacaoAcesso: values.observacaoAcesso.trim() || null,
      })
      setAtual(salvo)
      setFeedback({ type: 'success', message: `Dados confirmados em ${formatDateTime(salvo.dtConfirmacao)}. Obrigado!` })
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card flex max-w-2xl flex-col gap-4">
      <div>
        <h2 className="font-display text-xl font-bold">{atual.nome}</h2>
        <p className="text-sm text-slate-600">
          {atual.logradouro}, {atual.numero} · Última confirmação: {formatDateTime(atual.dtConfirmacao)}
        </p>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-semibold">Para sair de casa, a pessoa precisa de:</legend>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('precisaMaca')} /> Maca
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('precisaCadeira')} /> Cadeira de rodas
        </label>
      </fieldset>

      <FormField id="qtAcompanhante" label="Quantos acompanhantes vão junto?" error={errors.qtAcompanhante?.message}>
        <input
          id="qtAcompanhante"
          type="number"
          min={0}
          max={3}
          className="input sm:w-32"
          aria-invalid={!!errors.qtAcompanhante}
          {...register('qtAcompanhante', {
            required: 'Informe 0 se ninguém for junto.',
            min: { value: 0, message: 'Não pode ser negativo.' },
            max: { value: 3, message: 'No máximo 3 acompanhantes.' },
          })}
        />
      </FormField>

      <FormField id="observacaoAcesso" label="Existe alguma barreira na saída?" hint="Ex.: escada na entrada, corredor estreito">
        <textarea id="observacaoAcesso" rows={3} className="input" {...register('observacaoAcesso')} />
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

export function ConfirmarPage() {
  const { codigo } = useParams<{ codigo: string }>()
  const morador = useApi(() => (codigo ? getConfirmacao(codigo) : Promise.resolve(null)), [codigo])

  return (
    <div className="container-page">
      <PageHeader
        title="Confirmar necessidades"
        description="Morador ou cuidador: revise os dados para que a equipe certa chegue no momento de uma evacuação."
      />
      {!codigo && <BuscarCodigo />}
      {codigo && morador.loading && <StateMessage type="loading" message="Buscando cadastro..." />}
      {codigo && morador.error && (
        <div className="flex max-w-md flex-col gap-4">
          <StateMessage type="error" message={morador.error} />
          <BuscarCodigo />
        </div>
      )}
      {codigo && morador.data && <FormConfirmacao codigo={codigo} morador={morador.data} />}
    </div>
  )
}
