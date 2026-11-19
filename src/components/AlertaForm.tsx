import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createAlerta } from '@/services/alertas'
import { HttpError } from '@/services/http'
import type { Alerta, NivelAlerta, Setor } from '@/types/api'
import { FormField } from '@/components/FormField'
import { Feedback } from '@/components/Feedback'

interface AlertaFormProps {
  setores: Setor[]
  onCreated: (alerta: Alerta) => void
}

interface AlertaFormValues {
  idSetor: string
  nivel: NivelAlerta
}

export function AlertaForm({ setores, onCreated }: AlertaFormProps) {
  const [erroApi, setErroApi] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AlertaFormValues>()

  async function onSubmit(data: AlertaFormValues) {
    setErroApi('')
    try {
      const alerta = await createAlerta({ idSetor: Number(data.idSetor), nivel: data.nivel })
      onCreated(alerta)
    } catch (error) {
      if (error instanceof HttpError) {
        setErroApi(error.message)
      } else {
        setErroApi('Não foi possível conectar à API.')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card flex flex-col gap-4">
      <h2 className="font-display text-lg font-bold">Abrir alerta</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="alerta-setor" label="Setor" error={errors.idSetor && errors.idSetor.message}>
          <select id="alerta-setor" className="input" {...register('idSetor', { required: 'Escolha o setor do alerta.' })}>
            <option value="">Selecione</option>
            {setores.map((setor) => (
              <option key={setor.id} value={setor.id}>
                {setor.nome}
              </option>
            ))}
          </select>
        </FormField>
        <FormField id="alerta-nivel" label="Nível" error={errors.nivel && errors.nivel.message}>
          <select id="alerta-nivel" className="input" {...register('nivel', { required: 'Escolha o nível.' })}>
            <option value="">Selecione</option>
            <option value="AMARELO">Amarelo</option>
            <option value="LARANJA">Laranja</option>
            <option value="VERMELHO">Vermelho</option>
          </select>
        </FormField>
      </div>
      {erroApi && <Feedback type="error" message={erroApi} />}
      <button type="submit" className="btn-primary self-start" disabled={isSubmitting}>
        {isSubmitting ? 'Abrindo...' : 'Abrir alerta'}
      </button>
    </form>
  )
}
