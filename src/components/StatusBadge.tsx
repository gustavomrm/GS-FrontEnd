import type { MotivoPendencia, SituacaoAtendimento } from '@/types/api'
import { nomeMotivo, nomeSituacao } from '@/utils/format'

interface StatusBadgeProps {
  situacao: SituacaoAtendimento
  motivo: MotivoPendencia | null
}

function corDaSituacao(situacao: SituacaoAtendimento): string {
  if (situacao === 'AGUARDANDO') return 'border-amber-300 bg-amber-100 text-amber-900'
  if (situacao === 'CHEGADA_CONFIRMADA') return 'border-emerald-300 bg-emerald-100 text-emerald-900'
  if (situacao === 'RECUSADO') return 'border-slate-300 bg-slate-200 text-slate-800'
  return 'border-sky-300 bg-sky-100 text-sky-900'
}

export function StatusBadge({ situacao, motivo }: StatusBadgeProps) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${corDaSituacao(situacao)}`}>
        {nomeSituacao[situacao]}
      </span>
      {motivo && (
        <span className="rounded-full border border-red-300 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-800">
          {nomeMotivo[motivo]}
        </span>
      )}
    </span>
  )
}
