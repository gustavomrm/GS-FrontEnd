import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="container-page text-center">
      <p className="font-display text-6xl font-bold text-teal-700">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold">Página não encontrada</h1>
      <p className="mt-2 text-slate-600">O endereço digitado não existe neste site.</p>
      <Link to="/" className="btn-primary mt-6">
        Voltar ao início
      </Link>
    </div>
  )
}
