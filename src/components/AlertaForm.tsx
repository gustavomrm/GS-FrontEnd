import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Alerta, Setor } from '@/types/api'
import { createAlerta } from '@/services/alertas'
import { FormField } from '@/components/FormField'
import { Feedback } from '@/components/Feedback'

interface AlertaFormProps {
  setores: Setor[]
  onCreated: (alerta: Alerta) => void
}

interface AlertaFormValues {
  idSetor: string
  nivel: string
}

export function AlertaForm({ setores, onCreated }: AlertaFormProps) {
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AlertaFormValues>({ defaultValues: { idSetor: '', nivel: 'LARANJA' } })

  async function onSubmit(values: AlertaFormValues) {
    setFeedback(null)
    try {
      const alerta = await createAlerta({ idSetor: Number(values.idSetor), nivel: values.nivel })
      setFeedback({ type: 'success', message: `Alerta #${alerta.id} ativado e gravado na central.` })
      onCreated(alerta)
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card flex flex-col gap-4">
      <h2 className="font-display text-lg font-bold">Ativar alerta</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="alerta-setor" label="Setor" error={errors.idSetor?.message}>
          <select
            id="alerta-setor"
            className="input"
            aria-invalid={!!errors.idSetor}
            {...register('idSetor', { required: 'Escolha o setor do alerta.' })}
          >
            <option value="">Selecione</option>
            {setores.map((setor) => (
              <option key={setor.idSetor} value={setor.idSetor}>
                {setor.nome} (risco {setor.nivelRisco.toLowerCase()})
              </option>
            ))}
          </select>
        </FormField>
        <FormField id="alerta-nivel" label="Nível">
          <select id="alerta-nivel" className="input" {...register('nivel')}>
            <option value="AMARELO">Amarelo</option>
            <option value="LARANJA">Laranja</option>
            <option value="VERMELHO">Vermelho</option>
          </select>
        </FormField>
      </div>
      {feedback && <Feedback type={feedback.type} message={feedback.message} />}
      <button type="submit" className="btn-primary self-start" disabled={isSubmitting}>
        {isSubmitting ? 'Ativando...' : 'Ativar alerta'}
      </button>
    </form>
  )
}
