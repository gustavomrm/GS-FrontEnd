import { AlertCircle, Inbox, Loader2 } from 'lucide-react'

interface StateMessageProps {
  type: 'loading' | 'error' | 'empty'
  message?: string
  onRetry?: () => void
}

const padrao = {
  loading: 'Carregando dados da central...',
  error: 'Não foi possível carregar os dados.',
  empty: 'Nenhum registro encontrado.',
}

export function StateMessage({ type, message, onRetry }: StateMessageProps) {
  const Icon = type === 'loading' ? Loader2 : type === 'error' ? AlertCircle : Inbox
  const cor = type === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-slate-200 bg-white text-slate-600'

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`flex flex-col items-center gap-3 rounded-xl border px-4 py-8 text-center ${cor}`}
    >
      <Icon size={26} className={type === 'loading' ? 'animate-spin' : ''} aria-hidden="true" />
      <p className="text-sm font-medium">{message ?? padrao[type]}</p>
      {onRetry && (
        <button type="button" className="btn-secondary" onClick={onRetry}>
          Tentar de novo
        </button>
      )}
    </div>
  )
}
