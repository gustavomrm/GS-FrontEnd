import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { FormField } from '@/components/FormField'
import { Feedback } from '@/components/Feedback'
import { StateMessage } from '@/components/StateMessage'
import { useSetores } from '@/hooks/useSetores'
import { createMorador } from '@/services/moradores'
import { HttpError } from '@/services/http'

interface MoradorForm {
  idSetor: string
  nome: string
  endereco: string
  contato: string
  codigoConfirmacao: string
  precisaMaca: boolean
  usaCadeiraRodas: boolean
  qtAcompanhante: string
  barreiraAcesso: string
}

export function NovoMoradorPage() {
  const navigate = useNavigate()
  const { setores, loading, error } = useSetores()
  const [erroApi, setErroApi] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MoradorForm>()

  async function onSubmit(data: MoradorForm) {
    setErroApi('')
    try {
      const morador = await createMorador({
        idSetor: Number(data.idSetor),
        nome: data.nome,
        endereco: data.endereco,
        contato: data.contato,
        codigoConfirmacao: data.codigoConfirmacao,
        precisaMaca: data.precisaMaca,
        usaCadeiraRodas: data.usaCadeiraRodas,
        qtAcompanhante: Number(data.qtAcompanhante),
        barreiraAcesso: data.barreiraAcesso,
      })
      navigate('/moradores', { replace: true, state: `${morador.nome} foi cadastrado na central.` })
    } catch (error) {
      if (error instanceof HttpError) {
        setErroApi(error.message)
      } else {
        setErroApi('Não foi possível conectar à API.')
      }
    }
  }

  return (
    <div className="container-page max-w-3xl">
      <PageHeader title="Cadastrar morador" description="Use apenas dados fictícios. O código de confirmação é entregue ao cuidador.">
        <Link to="/moradores" className="btn-secondary">
          Voltar para a lista
        </Link>
      </PageHeader>

      {error && <StateMessage type="error" message={error} />}
      {!error && loading && <StateMessage type="loading" message="Carregando setores..." />}

      {!error && !loading && (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="card flex flex-col gap-4">
          <FormField id="nome" label="Nome (fictício)" error={errors.nome && errors.nome.message}>
            <input
              id="nome"
              className="input"
              {...register('nome', {
                required: 'Informe o nome.',
                minLength: { value: 3, message: 'O nome precisa ter ao menos 3 letras.' },
              })}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="idSetor" label="Setor" error={errors.idSetor && errors.idSetor.message}>
              <select id="idSetor" className="input" {...register('idSetor', { required: 'Escolha o setor.' })}>
                <option value="">Selecione</option>
                {setores.map((setor) => (
                  <option key={setor.id} value={setor.id}>
                    {setor.nome}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField id="contato" label="Telefone (fictício)" error={errors.contato && errors.contato.message}>
              <input
                id="contato"
                type="tel"
                placeholder="(11) 99999-0000"
                className="input"
                {...register('contato', {
                  required: 'Informe um telefone.',
                  pattern: { value: /^\(\d{2}\) \d{4,5}-\d{4}$/, message: 'Use o formato (11) 99999-0000.' },
                })}
              />
            </FormField>
          </div>

          <FormField id="endereco" label="Endereço" error={errors.endereco && errors.endereco.message}>
            <input
              id="endereco"
              placeholder="Rua A, 12"
              className="input"
              {...register('endereco', {
                required: 'Informe o endereço.',
                minLength: { value: 5, message: 'O endereço precisa ter ao menos 5 caracteres.' },
              })}
            />
          </FormField>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">Necessidades de transporte</p>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('precisaMaca')} /> Precisa de maca
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('usaCadeiraRodas')} /> Usa cadeira de rodas
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="qtAcompanhante" label="Acompanhantes" error={errors.qtAcompanhante && errors.qtAcompanhante.message}>
              <input
                id="qtAcompanhante"
                type="number"
                defaultValue="0"
                className="input"
                {...register('qtAcompanhante', {
                  required: 'Informe 0 se não houver.',
                  min: { value: 0, message: 'Não pode ser negativo.' },
                })}
              />
            </FormField>

            <FormField
              id="codigoConfirmacao"
              label="Código de confirmação"
              error={errors.codigoConfirmacao && errors.codigoConfirmacao.message}
            >
              <input
                id="codigoConfirmacao"
                placeholder="MARIA01"
                className="input"
                {...register('codigoConfirmacao', {
                  required: 'Crie um código para o cuidador.',
                  pattern: { value: /^[A-Za-z0-9-]{4,12}$/, message: 'Use de 4 a 12 letras, números ou hífen.' },
                })}
              />
            </FormField>
          </div>

          <FormField id="barreiraAcesso" label="Barreira de acesso (opcional)">
            <input id="barreiraAcesso" placeholder="Escada na entrada" className="input" {...register('barreiraAcesso')} />
          </FormField>

          {erroApi && <Feedback type="error" message={erroApi} />}

          <button type="submit" className="btn-primary self-start" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Cadastrar'}
          </button>
        </form>
      )}
    </div>
  )
}
