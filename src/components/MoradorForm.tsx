import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Morador, MoradorInput, Setor } from '@/types/api'
import { createMorador, updateMorador } from '@/services/moradores'
import { FormField } from '@/components/FormField'
import { Feedback } from '@/components/Feedback'

interface MoradorFormProps {
  setores: Setor[]
  editando: Morador | null
  onSaved: (morador: Morador) => void
  onCancel: () => void
}

interface MoradorFormValues {
  nome: string
  idSetor: string
  logradouro: string
  numero: string
  telefone: string
  latitude: string
  longitude: string
  precisaMaca: boolean
  precisaCadeira: boolean
  qtAcompanhante: string
  observacaoAcesso: string
}

function toValues(morador: Morador | null): MoradorFormValues {
  return {
    nome: morador?.nome ?? '',
    idSetor: morador ? String(morador.idSetor) : '',
    logradouro: morador?.logradouro ?? '',
    numero: morador?.numero ?? '',
    telefone: morador?.telefone ?? '',
    latitude: morador ? String(morador.latitude) : '',
    longitude: morador ? String(morador.longitude) : '',
    precisaMaca: morador?.precisaMaca ?? false,
    precisaCadeira: morador?.precisaCadeira ?? false,
    qtAcompanhante: morador ? String(morador.qtAcompanhante) : '0',
    observacaoAcesso: morador?.observacaoAcesso ?? '',
  }
}

function toInput(values: MoradorFormValues): MoradorInput {
  return {
    nome: values.nome.trim(),
    idSetor: Number(values.idSetor),
    logradouro: values.logradouro.trim(),
    numero: values.numero.trim(),
    telefone: values.telefone.trim(),
    latitude: Number(values.latitude),
    longitude: Number(values.longitude),
    precisaMaca: values.precisaMaca,
    precisaCadeira: values.precisaCadeira,
    qtAcompanhante: Number(values.qtAcompanhante),
    observacaoAcesso: values.observacaoAcesso.trim() || null,
  }
}

export function MoradorForm({ setores, editando, onSaved, onCancel }: MoradorFormProps) {
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<MoradorFormValues>({ defaultValues: toValues(editando) })

  async function onSubmit(values: MoradorFormValues) {
    setFeedback(null)
    try {
      const salvo = editando
        ? await updateMorador(editando.idMorador, toInput(values))
        : await createMorador(toInput(values))
      setFeedback({
        type: 'success',
        message: editando
          ? `Cadastro de ${salvo.nome} atualizado na central.`
          : `${salvo.nome} cadastrado. Código de confirmação: ${salvo.codigoConfirmacao}.`,
      })
      if (!editando) reset(toValues(null))
      onSaved(salvo)
    } catch (err) {
      const erro = err as Error & { campos?: { campo: string; mensagem: string }[] }
      erro.campos?.forEach(({ campo, mensagem }) => {
        if (campo in toValues(null)) setError(campo as keyof MoradorFormValues, { message: mensagem })
      })
      setFeedback({ type: 'error', message: erro.message })
    }
  }

  const ariaField = (name: keyof MoradorFormValues) => ({
    'aria-invalid': !!errors[name],
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card flex flex-col gap-4">
      <h2 className="font-display text-lg font-bold">{editando ? `Editar ${editando.nome}` : 'Cadastrar morador'}</h2>

      <FormField id="nome" label="Nome (fictício)" error={errors.nome?.message}>
        <input
          id="nome"
          className="input"
          {...ariaField('nome')}
          {...register('nome', {
            required: 'Informe o nome.',
            minLength: { value: 3, message: 'O nome precisa ter ao menos 3 letras.' },
          })}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="idSetor" label="Setor" error={errors.idSetor?.message}>
          <select id="idSetor" className="input" {...ariaField('idSetor')} {...register('idSetor', { required: 'Escolha o setor.' })}>
            <option value="">Selecione</option>
            {setores.map((setor) => (
              <option key={setor.idSetor} value={setor.idSetor}>
                {setor.nome}
              </option>
            ))}
          </select>
        </FormField>
        <FormField id="telefone" label="Telefone (fictício)" error={errors.telefone?.message} hint="Formato (11) 99999-0000">
          <input
            id="telefone"
            type="tel"
            className="input"
            {...ariaField('telefone')}
            {...register('telefone', {
              required: 'Informe um telefone de contato.',
              pattern: { value: /^\(\d{2}\) \d{4,5}-\d{4}$/, message: 'Use o formato (11) 99999-0000.' },
            })}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <FormField id="logradouro" label="Logradouro" error={errors.logradouro?.message}>
          <input id="logradouro" className="input" {...ariaField('logradouro')} {...register('logradouro', { required: 'Informe a rua.' })} />
        </FormField>
        <FormField id="numero" label="Número" error={errors.numero?.message}>
          <input id="numero" className="input" {...ariaField('numero')} {...register('numero', { required: 'Informe o número.' })} />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="latitude" label="Latitude" error={errors.latitude?.message}>
          <input
            id="latitude"
            inputMode="decimal"
            className="input"
            {...ariaField('latitude')}
            {...register('latitude', {
              required: 'Informe a latitude.',
              validate: (v) => (Number(v) >= -90 && Number(v) <= 90 && v.trim() !== '') || 'Latitude entre -90 e 90.',
            })}
          />
        </FormField>
        <FormField id="longitude" label="Longitude" error={errors.longitude?.message}>
          <input
            id="longitude"
            inputMode="decimal"
            className="input"
            {...ariaField('longitude')}
            {...register('longitude', {
              required: 'Informe a longitude.',
              validate: (v) => (Number(v) >= -180 && Number(v) <= 180 && v.trim() !== '') || 'Longitude entre -180 e 180.',
            })}
          />
        </FormField>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-semibold">Necessidades de transporte</legend>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('precisaMaca')} /> Precisa de maca
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('precisaCadeira')} /> Usa cadeira de rodas
        </label>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
        <FormField id="qtAcompanhante" label="Acompanhantes" error={errors.qtAcompanhante?.message}>
          <input
            id="qtAcompanhante"
            type="number"
            min={0}
            max={3}
            className="input"
            {...ariaField('qtAcompanhante')}
            {...register('qtAcompanhante', {
              required: 'Informe 0 se não houver.',
              min: { value: 0, message: 'Não pode ser negativo.' },
              max: { value: 3, message: 'No máximo 3 acompanhantes.' },
            })}
          />
        </FormField>
        <FormField id="observacaoAcesso" label="Barreira de acesso (opcional)" hint="Ex.: escada na entrada, portão estreito">
          <input id="observacaoAcesso" className="input" {...register('observacaoAcesso')} />
        </FormField>
      </div>

      {feedback && <Feedback type={feedback.type} message={feedback.message} />}

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : editando ? 'Salvar alterações' : 'Cadastrar'}
        </button>
        {editando && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancelar edição
          </button>
        )}
      </div>
    </form>
  )
}
