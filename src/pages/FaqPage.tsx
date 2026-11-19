import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { perguntas } from '@/data/faq'

export function FaqPage() {
  const [aberta, setAberta] = useState('')

  function handleToggle(pergunta: string) {
    setAberta((prev) => (prev === pergunta ? '' : pergunta))
  }

  return (
    <div className="container-page max-w-3xl">
      <PageHeader title="Perguntas frequentes" description="Cadastro, confirmação, indisponibilidade, modo local e limites da simulação." />

      <ul className="flex flex-col gap-3">
        {perguntas.map((item) => (
          <li key={item.pergunta} className="card p-0">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 rounded-xl px-5 py-4 text-left font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              onClick={() => handleToggle(item.pergunta)}
            >
              {item.pergunta}
              <span className="text-xl text-teal-700">{aberta === item.pergunta ? '−' : '+'}</span>
            </button>
            {aberta === item.pergunta && <p className="px-5 pb-4 text-sm text-slate-600">{item.resposta}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}
