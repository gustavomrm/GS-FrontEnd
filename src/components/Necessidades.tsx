import type { Morador } from '@/types/api'

interface NecessidadesProps {
  morador: Morador
}

export function Necessidades({ morador }: NecessidadesProps) {
  const semNecessidade = !morador.precisaMaca && !morador.usaCadeiraRodas && morador.qtAcompanhante === 0

  return (
    <ul className="flex flex-wrap gap-1.5">
      {morador.precisaMaca && <li className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">Maca</li>}
      {morador.usaCadeiraRodas && (
        <li className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">Cadeira de rodas</li>
      )}
      {morador.qtAcompanhante > 0 && (
        <li className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
          {morador.qtAcompanhante} acompanhante(s)
        </li>
      )}
      {semNecessidade && <li className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">Assento comum</li>}
    </ul>
  )
}
