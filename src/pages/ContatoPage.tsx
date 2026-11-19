import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { FormField } from '@/components/FormField'
import { Feedback } from '@/components/Feedback'

interface ContatoForm {
  nome: string
  email: string
  assunto: string
  mensagem: string
}

const EMAIL_EQUIPE = 'gustavo.mrm7@gmail.com'

export function ContatoPage() {
  const [nomeEnviado, setNomeEnviado] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContatoForm>()

  function onSubmit(data: ContatoForm) {
    setNomeEnviado(data.nome)
  }

  if (nomeEnviado) {
    return (
      <div className="container-page flex max-w-2xl flex-col gap-4">
        <Feedback
          type="success"
          message={`Obrigado, ${nomeEnviado}! Sua mensagem foi validada. Nesta versão acadêmica o envio é simulado; para falar com a equipe, use ${EMAIL_EQUIPE}.`}
        />
        <Link to="/" className="btn-primary self-start">
          Voltar ao início
        </Link>
      </div>
    )
  }

  return (
    <div className="container-page grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <PageHeader title="Contato" description="Dúvidas sobre o projeto ou interesse em testar a solução no seu município?" />
        <div className="card flex flex-col gap-2 text-sm">
          <p className="flex items-center gap-2 font-semibold">
            <Mail size={16} /> {EMAIL_EQUIPE}
          </p>
          <p className="text-slate-600">Preencha o formulário ou escreva direto para o e-mail da equipe.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card flex flex-col gap-4">
        <FormField id="nome" label="Nome" error={errors.nome && errors.nome.message}>
          <input
            id="nome"
            className="field"
            {...register('nome', {
              required: 'Informe seu nome.',
              minLength: { value: 3, message: 'O nome precisa ter ao menos 3 letras.' },
            })}
          />
        </FormField>

        <FormField id="email" label="E-mail" error={errors.email && errors.email.message}>
          <input
            id="email"
            type="email"
            className="field"
            {...register('email', {
              required: 'Informe seu e-mail.',
              pattern: { value: /\S+@\S+\.\S+/, message: 'Digite um e-mail válido, como nome@dominio.com.' },
            })}
          />
        </FormField>

        <FormField id="assunto" label="Assunto" error={errors.assunto && errors.assunto.message}>
          <select id="assunto" className="field" {...register('assunto', { required: 'Escolha um assunto.' })}>
            <option value="">Selecione</option>
            <option value="duvida">Dúvida sobre o projeto</option>
            <option value="municipio">Interesse de município</option>
            <option value="sugestao">Sugestão</option>
          </select>
        </FormField>

        <FormField id="mensagem" label="Mensagem" error={errors.mensagem && errors.mensagem.message}>
          <textarea
            id="mensagem"
            rows={5}
            className="field"
            {...register('mensagem', {
              required: 'Escreva sua mensagem.',
              minLength: { value: 10, message: 'A mensagem precisa ter ao menos 10 caracteres.' },
            })}
          />
        </FormField>

        <button type="submit" className="btn-primary self-start">
          Enviar mensagem
        </button>
      </form>
    </div>
  )
}
