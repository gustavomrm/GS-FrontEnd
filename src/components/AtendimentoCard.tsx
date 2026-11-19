import { memo } from 'react'
import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import type { Atendimento } from '@/types/api'
import { StatusBadge } from '@/components/StatusBadge'
import { Necessidades } from '@/components/Necessidades'

interface AtendimentoCardProps {
  atendimento: Atendimento
}

export const AtendimentoCard = memo(function AtendimentoCard({ atendimento }: AtendimentoCardProps) {
  return (
    <li className="card flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Atendimento #{atendimento.id}</p>
          <h3 className="font-display text-lg font-bold">{atendimento.morador.nome}</h3>
        </div>
        <StatusBadge situacao={atendimento.situacao} motivo={atendimento.motivoPendencia} />
      </div>

      <p className="flex items-center gap-1.5 text-sm text-slate-600">
        <MapPin size={15} />
        {atendimento.morador.endereco}
      </p>

      <Necessidades morador={atendimento.morador} />

      <Link to={`/atendimentos/${atendimento.id}`} className="btn-secondary mt-auto self-start">
        Ver detalhe
      </Link>
    </li>
  )
})
