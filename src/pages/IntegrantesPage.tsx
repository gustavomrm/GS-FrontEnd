import { ExternalLink } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { integrantes } from '@/data/integrantes'

export function IntegrantesPage() {
  return (
    <div className="container-page">
      <PageHeader title="Integrantes" description="Equipe responsável pelo Saída Assistida na Global Solution 2026/2." />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrantes.map((pessoa) => (
          <li key={pessoa.rm} className="card flex flex-col gap-3">
            <img
              src={`https://github.com/${pessoa.github}.png?size=160`}
              alt={`Foto de ${pessoa.nome}`}
              width={80}
              height={80}
              loading="lazy"
              className="h-20 w-20 rounded-full border border-slate-200 bg-slate-100 object-cover"
            />
            <div>
              <h2 className="font-display text-lg font-bold">{pessoa.nome}</h2>
              <p className="text-sm text-slate-600">
                RM {pessoa.rm} · {pessoa.turma}
              </p>
            </div>
            <p className="text-sm text-slate-700">{pessoa.papel}</p>
            <a
              href={`https://github.com/${pessoa.github}`}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary mt-auto self-start"
            >
              <ExternalLink size={16} aria-hidden="true" /> GitHub: {pessoa.github}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
