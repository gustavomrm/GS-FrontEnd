import type { Veiculo } from '@/types/api'

interface VeiculosPanelProps {
  veiculos: Veiculo[]
}

export function VeiculosPanel({ veiculos }: VeiculosPanelProps) {
  return (
    <section className="card overflow-hidden p-0">
      <h2 className="px-5 pt-5 font-display text-lg font-bold">Capacidade dos veículos</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase text-slate-600">
            <tr>
              <th scope="col" className="px-5 py-2">Veículo</th>
              <th scope="col" className="px-3 py-2">Assentos</th>
              <th scope="col" className="px-3 py-2">Cadeiras</th>
              <th scope="col" className="px-3 py-2">Macas</th>
              <th scope="col" className="px-3 py-2">Situação</th>
            </tr>
          </thead>
          <tbody>
            {veiculos.map((veiculo) => (
              <tr key={veiculo.id} className="border-t border-slate-200">
                <th scope="row" className="px-5 py-2 font-semibold">
                  {veiculo.nome}
                  <span className="block text-xs font-normal text-slate-500">{veiculo.tipo}</span>
                </th>
                <td className="px-3 py-2">{veiculo.qtAssentos}</td>
                <td className="px-3 py-2">{veiculo.qtCadeiras}</td>
                <td className="px-3 py-2">{veiculo.qtMacas}</td>
                <td className="px-3 py-2">
                  {veiculo.disponivel ? (
                    <span className="font-semibold text-emerald-800">Habilitado</span>
                  ) : (
                    <span className="font-semibold text-red-700">Indisponível</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
