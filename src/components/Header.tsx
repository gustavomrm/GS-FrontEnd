import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { LifeBuoy, Menu, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Início', end: true },
  { to: '/sobre', label: 'Sobre' },
  { to: '/operacao', label: 'Operação' },
  { to: '/moradores', label: 'Moradores' },
  { to: '/analises', label: 'Análises' },
  { to: '/faq', label: 'FAQ' },
  { to: '/integrantes', label: 'Integrantes' },
  { to: '/contato', label: 'Contato' },
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-teal-700 text-white' : 'text-slate-700 hover:bg-slate-200'
  }`

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <LifeBuoy className="text-teal-700" size={22} aria-hidden="true" />
          Saída <span className="text-teal-700">Assistida</span>
        </Link>

        <button
          type="button"
          className="btn-secondary px-3 lg:hidden"
          aria-expanded={open}
          aria-controls="menu-principal"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className={linkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {open && (
        <nav id="menu-principal" aria-label="Principal" className="border-t border-slate-200 lg:hidden">
          <ul className="mx-auto grid max-w-6xl gap-1 px-4 py-3 sm:grid-cols-2">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className={linkClass} onClick={() => setOpen(false)}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
