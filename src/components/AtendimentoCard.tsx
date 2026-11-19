import { memo } from 'react'
import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import type { Atendimento } from '@/types/api'
import { StatusBadge } from '@/components/StatusBadge'
import { necessidades } from '@/utils/format'

interface AtendimentoCardProps {
  atendimento: Atendimento
}

export const AtendimentoCard = memo(function AtendimentoCard({ atendimento }: AtendimentoCardProps) {
  const { morador } = atendimento

  return (
    <li className="card flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Atendimento #{atendimento.id}
          </p>
          <h3 className="font-display text-lg font-bold">{morador.nome}</h3>
        </div>
        <StatusBadge estado={atendimento.situacao} motivo={atendimento.motivoPendencia} />
      </div>

      <p className="flex items-center gap-1.5 text-sm text-slate-600">
        <MapPin size={15} aria-hidden="true" />
        {morador.endereco}
      </p>

      <ul className="flex flex-wrap gap-1.5" aria-label="Necessidades">
        {necessidades(morador).map((item) => (
          <li key={item} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
            {item}
          </li>
        ))}
      </ul>

      <Link to={`/atendimentos/${atendimento.id}`} className="btn-secondary mt-auto self-start">
        Ver detalhe
      </Link>
    </li>
  )
})
