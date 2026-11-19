import { PageHeader } from '@/components/PageHeader'
import { perguntas } from '@/data/faq'

export function FaqPage() {
  return (
    <div className="container-page max-w-3xl">
      <PageHeader title="Perguntas frequentes" description="Cadastro, confirmação, indisponibilidade, modo local e limites da simulação." />

      <div className="flex flex-col gap-3">
        {perguntas.map((item) => (
          <details key={item.pergunta} className="card group p-0">
            <summary className="cursor-pointer list-none rounded-xl px-5 py-4 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
              <span className="flex items-center justify-between gap-4">
                {item.pergunta}
                <span className="text-xl text-teal-700 transition group-open:rotate-45" aria-hidden="true">+</span>
              </span>
            </summary>
            <p className="px-5 pb-4 text-sm text-slate-600">{item.resposta}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
