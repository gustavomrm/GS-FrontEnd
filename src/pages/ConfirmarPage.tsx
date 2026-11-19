import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { FormField } from '@/components/FormField'

interface CodigoForm {
  codigo: string
}

export function ConfirmarPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CodigoForm>()

  function onSubmit(data: CodigoForm) {
    navigate(`/confirmar/${data.codigo}`)
  }

  return (
    <div className="container-page">
      <PageHeader
        title="Confirmar necessidades"
        description="Morador ou cuidador: digite o código recebido do agente da Defesa Civil para revisar os dados."
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card flex max-w-md flex-col gap-4">
        <FormField id="codigo" label="Código de confirmação" error={errors.codigo && errors.codigo.message}>
          <input
            id="codigo"
            className="input"
            {...register('codigo', {
              required: 'Digite o código.',
              pattern: { value: /^[A-Za-z0-9-]{4,12}$/, message: 'O código tem de 4 a 12 letras, números ou hífen.' },
            })}
          />
        </FormField>
        <button type="submit" className="btn-primary self-start">
          Continuar
        </button>
      </form>
    </div>
  )
}
