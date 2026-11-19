import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Morador, MoradorInput, Setor } from '@/types/api'
import { HttpError } from '@/services/http'
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
  endereco: string
  codigoConfirmacao: string
  contato: string
  latitude: string
  longitude: string
  precisaMaca: boolean
  usaCadeiraRodas: boolean
  qtAcompanhante: string
  barreiraAcesso: string
}

function toValues(morador: Morador | null): MoradorFormValues {
  return {
    nome: morador?.nome ?? '',
    idSetor: morador ? String(morador.setor.id) : '',
    endereco: morador?.endereco ?? '',
    codigoConfirmacao: '',
    contato: morador?.contato ?? '',
    latitude: morador ? String(morador.latitude) : '',
    longitude: morador ? String(morador.longitude) : '',
    precisaMaca: morador?.precisaMaca ?? false,
    usaCadeiraRodas: morador?.usaCadeiraRodas ?? false,
    qtAcompanhante: morador ? String(morador.qtAcompanhante) : '0',
    barreiraAcesso: morador?.barreiraAcesso ?? '',
  }
}

function toInput(values: MoradorFormValues): MoradorInput {
  return {
    nome: values.nome.trim(),
    idSetor: Number(values.idSetor),
    endereco: values.endereco.trim(),
    contato: values.contato.trim() || null,
    latitude: Number(values.latitude),
    longitude: Number(values.longitude),
    precisaMaca: values.precisaMaca,
    usaCadeiraRodas: values.usaCadeiraRodas,
    qtAcompanhante: Number(values.qtAcompanhante),
    barreiraAcesso: values.barreiraAcesso.trim() || null,
  }
}

export function MoradorForm({ setores, editando, onSaved, onCancel }: MoradorFormProps) {
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MoradorFormValues>({ defaultValues: toValues(editando) })

  async function onSubmit(values: MoradorFormValues) {
    setFeedback(null)
    try {
      const dados = toInput(values)
      const codigo = values.codigoConfirmacao.trim()
      const salvo = editando
        ? await updateMorador(editando.id, dados)
        : await createMorador({ ...dados, codigoConfirmacao: codigo })
      setFeedback({
        type: 'success',
        message: editando
          ? `Cadastro de ${salvo.nome} atualizado na central.`
          : `${salvo.nome} cadastrado. Código de confirmação: ${codigo}.`,
      })
      if (!editando) reset(toValues(null))
      onSaved(salvo)
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Falha ao salvar o morador.'
      const campos = err instanceof HttpError ? err.campos ?? [] : []
      setFeedback({ type: 'error', message: [mensagem, ...campos].join(' ') })
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
          maxLength={100}
          className="input"
          {...ariaField('nome')}
          {...register('nome', {
            required: 'Informe o nome.',
            validate: (v) => !!v.trim() || 'Informe o nome.',
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
        <FormField id="contato" label="Contato (opcional)">
          <input id="contato" maxLength={30} className="input" {...register('contato')} />
        </FormField>
      </div>

      <FormField id="endereco" label="Endereço completo" error={errors.endereco?.message}>
        <input id="endereco" maxLength={200} className="input" {...ariaField('endereco')}
          {...register('endereco', { validate: (v) => !!v.trim() || 'Informe o endereço.' })} />
      </FormField>
      {!editando && (
        <FormField id="codigoConfirmacao" label="Código de confirmação" error={errors.codigoConfirmacao?.message}
          hint="Escolha um código para entregar ao morador ou cuidador.">
          <input id="codigoConfirmacao" className="input" maxLength={12} {...ariaField('codigoConfirmacao')}
            {...register('codigoConfirmacao', {
              required: 'Informe um código.',
              pattern: { value: /^[A-Za-z0-9_-]{4,12}$/, message: 'Use 4 a 12 letras, números, hífens ou sublinhados.' },
            })} />
        </FormField>
      )}

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
          <input type="checkbox" {...register('usaCadeiraRodas')} /> Usa cadeira de rodas
        </label>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
        <FormField id="qtAcompanhante" label="Acompanhantes" error={errors.qtAcompanhante?.message}>
          <input
            id="qtAcompanhante"
            type="number"
            min={0}
            max={5}
            className="input"
            {...ariaField('qtAcompanhante')}
            {...register('qtAcompanhante', {
              required: 'Informe 0 se não houver.',
              min: { value: 0, message: 'Não pode ser negativo.' },
              max: { value: 5, message: 'No máximo 5 acompanhantes.' },
              validate: (v) => Number.isInteger(Number(v)) || 'Informe um número inteiro.',
            })}
          />
        </FormField>
        <FormField id="barreiraAcesso" label="Barreira de acesso (opcional)" hint="Ex.: escada na entrada, portão estreito">
          <input id="barreiraAcesso" maxLength={200} className="input" {...register('barreiraAcesso')} />
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
