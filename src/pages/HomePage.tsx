import { Link } from 'react-router-dom'

const passos = [
  {
    titulo: 'Cadastrar e confirmar',
    texto: 'O agente cadastra o morador e o cuidador confirma maca, cadeira de rodas, acompanhantes e barreiras de acesso.',
  },
  {
    titulo: 'Abrir o alerta',
    texto: 'O operador abre o alerta do setor e inclui na fila os moradores que precisam de apoio.',
  },
  {
    titulo: 'Designar o transporte',
    texto: 'Cada atendimento recebe um veículo, um destino e um responsável disponíveis.',
  },
  {
    titulo: 'Confirmar a chegada',
    texto: 'A equipe registra embarque e chegada. Só conta como concluído quando a chegada é confirmada.',
  },
]

export function HomePage() {
  return (
    <>
      <section className="bg-teal-800 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:items-center md:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-200">CitizenTech · Defesa Civil</p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Ninguém fica para trás quando o alerta toca.
            </h1>
            <p className="mt-4 text-lg text-teal-50">
              O Saída Assistida ajuda a Defesa Civil a organizar a evacuação de idosos, pessoas com deficiência e
              acamados, do cadastro até a chegada confirmada ao destino.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/operacao" className="btn-primary bg-white text-teal-900 hover:bg-teal-50">
                Ver a demonstração
              </Link>
              <Link to="/sobre" className="btn-secondary border-teal-300 bg-transparent text-white hover:bg-teal-700">
                Como funciona
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-teal-900/60 p-6">
            <p className="text-sm font-semibold text-teal-200">O problema</p>
            <p className="mt-2 text-teal-50">
              Em enchentes e deslizamentos, quem não consegue sair sozinho depende de uma equipe certa, no veículo
              certo, indo para um destino que consiga recebê-lo. Sem uma lista atualizada, essas pessoas são as
              últimas a serem lembradas.
            </p>
            <p className="mt-4 text-sm text-teal-200">ODS 10, 11 e 13</p>
          </div>
        </div>
      </section>

      <section className="container-page">
        <h2 className="font-display text-2xl font-bold">A jornada em quatro passos</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {passos.map((passo, index) => (
            <li key={passo.titulo} className="card">
              <p className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 font-display font-bold text-teal-800">
                {index + 1}
              </p>
              <h3 className="mt-3 font-display text-lg font-bold">{passo.titulo}</h3>
              <p className="mt-1 text-sm text-slate-600">{passo.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page pt-0">
        <div className="card grid gap-4 md:grid-cols-3">
          <div>
            <h2 className="font-display text-lg font-bold">Para quem</h2>
            <p className="mt-1 text-sm text-slate-600">Moradores que precisam de apoio para sair de casa e seus cuidadores.</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Quem opera</h2>
            <p className="mt-1 text-sm text-slate-600">Defesa Civil municipal, com Saúde e Assistência Social.</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Dados</h2>
            <p className="mt-1 text-sm text-slate-600">Esta demonstração usa somente pessoas e endereços fictícios.</p>
          </div>
        </div>
      </section>
    </>
  )
}
