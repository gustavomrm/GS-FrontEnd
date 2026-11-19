import { StateMessage } from '@/components/StateMessage'
import { useVeiculos } from '@/hooks/useVeiculos'

export function VeiculosPanel() {
  const { veiculos, loading, error } = useVeiculos()

  if (error) return <StateMessage type="error" message={error} />
  if (loading) return <StateMessage type="loading" message="Carregando veículos..." />
  if (veiculos.length === 0) return <StateMessage type="empty" message="Nenhum veículo cadastrado." />

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl font-bold">Capacidade dos veículos</h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {veiculos.map((veiculo) => (
          <li key={veiculo.id} className="card flex flex-col gap-1 text-sm">
            <h3 className="font-semibold">{veiculo.nome}</h3>
            <p className="text-xs text-slate-500">{veiculo.tipo}</p>
            <p>
              {veiculo.qtAssentos} assentos · {veiculo.qtCadeiras} cadeiras · {veiculo.qtMacas} macas
            </p>
            <p className={veiculo.disponivel ? 'font-semibold text-emerald-800' : 'font-semibold text-red-700'}>
              {veiculo.disponivel ? 'Disponível' : 'Indisponível'}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
