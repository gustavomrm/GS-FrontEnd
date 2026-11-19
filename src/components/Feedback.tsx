import { CheckCircle2, XCircle } from 'lucide-react'

interface FeedbackProps {
  type: 'success' | 'error'
  message: string
}

export function Feedback({ type, message }: FeedbackProps) {
  return (
    <p
      role={type === 'success' ? 'status' : 'alert'}
      className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
        type === 'success' ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-red-300 bg-red-50 text-red-800'
      }`}
    >
      {type === 'success' ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <XCircle size={18} className="mt-0.5 shrink-0" />}
      {message}
    </p>
  )
}
