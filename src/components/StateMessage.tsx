import { AlertCircle, Inbox, Loader2 } from 'lucide-react'

interface StateMessageProps {
  type: 'loading' | 'error' | 'empty'
  message: string
}

export function StateMessage({ type, message }: StateMessageProps) {
  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`flex flex-col items-center gap-3 rounded-xl border px-4 py-8 text-center ${
        type === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-slate-200 bg-white text-slate-600'
      }`}
    >
      {type === 'loading' && <Loader2 size={26} className="animate-spin" />}
      {type === 'error' && <AlertCircle size={26} />}
      {type === 'empty' && <Inbox size={26} />}
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}
