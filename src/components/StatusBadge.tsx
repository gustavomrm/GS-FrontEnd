import { memo } from 'react'
import { AlertTriangle, CheckCircle2, Clock, Truck } from 'lucide-react'
import type { EstadoAtendimento, MotivoPendencia } from '@/types/api'
import { estadoLabel, motivoLabel } from '@/utils/format'

interface StatusBadgeProps {
  estado: EstadoAtendimento
  motivo?: MotivoPendencia | null
}

const estilos: Record<EstadoAtendimento, string> = {
  RECUSADO: 'bg-slate-200 text-slate-800 border-slate-300',
  AGUARDANDO: 'bg-amber-100 text-amber-900 border-amber-300',
  DESIGNADA: 'bg-sky-100 text-sky-900 border-sky-300',
  EQUIPE_A_CAMINHO: 'bg-sky-100 text-sky-900 border-sky-300',
  EMBARCADA: 'bg-indigo-100 text-indigo-900 border-indigo-300',
  CHEGADA_CONFIRMADA: 'bg-emerald-100 text-emerald-900 border-emerald-300',
}

export const StatusBadge = memo(function StatusBadge({ estado, motivo }: StatusBadgeProps) {
  const Icon = estado === 'CHEGADA_CONFIRMADA' ? CheckCircle2 : estado === 'AGUARDANDO' ? Clock : estado === 'RECUSADO' ? AlertTriangle : Truck

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${estilos[estado]}`}>
        <Icon size={13} aria-hidden="true" />
        {estadoLabel[estado]}
      </span>
      {motivo && (
        <span className="inline-flex items-center gap-1 rounded-full border border-red-300 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-800">
          <AlertTriangle size={13} aria-hidden="true" />
          {motivoLabel[motivo]}
        </span>
      )}
    </span>
  )
})
