import type { FallbackProps } from 'react-error-boundary'

export function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="container-page">
      <div className="card text-center">
        <h1 className="font-display text-xl font-bold">Algo deu errado nesta tela.</h1>
        <p className="mt-2 text-slate-600">Tente carregar de novo. Se continuar, volte para o início.</p>
        <button type="button" className="btn-primary mt-4" onClick={resetErrorBoundary}>
          Tentar de novo
        </button>
      </div>
    </div>
  )
}
