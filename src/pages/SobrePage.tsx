import { PageHeader } from '@/components/PageHeader'

const blocos = [
  {
    titulo: 'Como a solução funciona',
    texto:
      'A central guarda moradores, alertas, viagens e atendimentos em uma API Java ligada ao Oracle. Este site consulta e grava nessa API. Quando um alerta é ativado em um setor, cada morador elegível vira um atendimento que passa por estados até a chegada confirmada.',
  },
  {
    titulo: 'Quem opera',
    texto:
      'O operador da Defesa Civil decide; o sistema organiza e registra. Ele vê a fila do setor, as capacidades dos veículos e as pendências, e confirma uma viagem compatível.',
  },
  {
    titulo: 'Quem é beneficiado',
    texto:
      'Moradores com mobilidade reduzida, acamados, idosos e pessoas com deficiência, além dos cuidadores, que participam da confirmação dos dados.',
  },
  {
    titulo: 'Equipe em campo',
    texto:
      'As equipes registram embarque e chegada. Sem internet, usam o programa local em Python e enviam os eventos depois, sem duplicar registros.',
  },
]

const estados = ['Aguardando', 'Viagem designada', 'Equipe a caminho', 'Embarcada', 'Chegada confirmada']

const ods = [
  { numero: 10, nome: 'Redução das desigualdades', texto: 'Prioriza quem tem mais dificuldade para sair sozinho.' },
  { numero: 11, nome: 'Cidades e comunidades sustentáveis', texto: 'Fortalece a resposta municipal a desastres.' },
  { numero: 13, nome: 'Ação contra a mudança global do clima', texto: 'Prepara a cidade para eventos extremos mais frequentes.' },
]

export function SobrePage() {
  return (
    <div className="container-page">
      <PageHeader
        title="Sobre o Saída Assistida"
        description="Uma plataforma para preparar e coordenar a evacuação de pessoas que precisam de apoio, com alocação compatível e acompanhamento até a chegada."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {blocos.map((bloco) => (
          <section key={bloco.titulo} className="card">
            <h2 className="font-display text-lg font-bold">{bloco.titulo}</h2>
            <p className="mt-2 text-sm text-slate-600">{bloco.texto}</p>
          </section>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold">Estados de um atendimento</h2>
        <ol className="mt-4 flex flex-wrap items-center gap-2">
          {estados.map((estado, index) => (
            <li key={estado} className="flex items-center gap-2">
              <span className="rounded-full border border-teal-300 bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-900">
                {index + 1}. {estado}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-slate-600">
          Sem contato, acesso impedido, sem recurso e saída própria pendente aparecem como pendências. Nenhuma delas conta como chegada.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold">ODS relacionados</h2>
        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          {ods.map((item) => (
            <li key={item.numero} className="card">
              <p className="font-display text-3xl font-bold text-teal-700">{item.numero}</p>
              <h3 className="font-semibold">{item.nome}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card mt-8 border-amber-300 bg-amber-50">
        <h2 className="font-display text-lg font-bold">Limites do MVP</h2>
        <p className="mt-2 text-sm text-slate-700">
          Sem integração real com e-SUS, WhatsApp, SMS ou gov.br; sem dados reais de saúde; sem previsão de enchente,
          navegação por ruas ou garantia de rota segura. Uma pessoa sem atendimento possível aparece como pendência,
          e chegada registrada não é estimativa de vidas salvas.
        </p>
      </section>
    </div>
  )
}
