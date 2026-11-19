import type { ReactNode } from 'react'

interface FormFieldProps {
  id: string
  label: string
  error?: string
  children: ReactNode
}

export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-slate-800">
        {label}
      </label>
      {children}
      {error && <p className="text-xs font-semibold text-red-700">{error}</p>}
    </div>
  )
}
