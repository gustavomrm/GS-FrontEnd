import { useState } from 'react'
import { useForm } from 'react-hook-form'
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

const EMAIL_EQUIPE = 'saidaassistida.fiap@gmail.com'

export function ContatoPage() {
  const [enviado, setEnviado] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContatoForm>()

  function onSubmit(data: ContatoForm) {
    const assunto = encodeURIComponent(`[Saída Assistida] ${data.assunto}`)
    const corpo = encodeURIComponent(`${data.mensagem}\n\n${data.nome} <${data.email}>`)
    window.location.href = `mailto:${EMAIL_EQUIPE}?subject=${assunto}&body=${corpo}`
    setEnviado(true)
    reset()
  }

  return (
    <div className="container-page grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <PageHeader title="Contato" description="Dúvidas sobre o projeto ou interesse em testar a solução no seu município?" />
        <div className="card flex flex-col gap-2 text-sm">
          <p className="flex items-center gap-2 font-semibold">
            <Mail size={16} aria-hidden="true" /> {EMAIL_EQUIPE}
          </p>
          <p className="text-slate-600">
            O formulário valida os campos e abre o seu aplicativo de e-mail com a mensagem pronta. O envio só acontece
            quando você confirma no seu e-mail.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card flex flex-col gap-4">
        <FormField id="nome" label="Nome" error={errors.nome?.message}>
          <input
            id="nome"
            className="input"
            autoComplete="name"
            aria-invalid={!!errors.nome}
            aria-describedby={errors.nome ? 'nome-error' : undefined}
            {...register('nome', {
              required: 'Informe seu nome.',
              minLength: { value: 3, message: 'O nome precisa ter ao menos 3 letras.' },
            })}
          />
        </FormField>

        <FormField id="email" label="E-mail" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            className="input"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email', {
              required: 'Informe seu e-mail.',
              pattern: { value: /\S+@\S+\.\S+/, message: 'Digite um e-mail válido, como nome@dominio.com.' },
            })}
          />
        </FormField>

        <FormField id="assunto" label="Assunto" error={errors.assunto?.message}>
          <select
            id="assunto"
            className="input"
            aria-invalid={!!errors.assunto}
            defaultValue=""
            {...register('assunto', { required: 'Escolha um assunto.' })}
          >
            <option value="" disabled>
              Selecione
            </option>
            <option>Dúvida sobre o projeto</option>
            <option>Interesse de município</option>
            <option>Sugestão</option>
          </select>
        </FormField>

        <FormField id="mensagem" label="Mensagem" error={errors.mensagem?.message}>
          <textarea
            id="mensagem"
            rows={5}
            className="input"
            aria-invalid={!!errors.mensagem}
            aria-describedby={errors.mensagem ? 'mensagem-error' : undefined}
            {...register('mensagem', {
              required: 'Escreva sua mensagem.',
              minLength: { value: 10, message: 'A mensagem precisa ter ao menos 10 caracteres.' },
            })}
          />
        </FormField>

        {enviado && (
          <Feedback type="success" message="Mensagem pronta. Confirme o envio no aplicativo de e-mail que acabou de abrir." />
        )}

        <button type="submit" className="btn-primary self-start">
          Preparar e-mail
        </button>
      </form>
    </div>
  )
}
