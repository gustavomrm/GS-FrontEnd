export const perguntas = [
  {
    pergunta: 'Quem usa o Saída Assistida?',
    resposta:
      'A Defesa Civil municipal opera a central. Agentes cadastram moradores que precisam de apoio, e moradores ou cuidadores confirmam as necessidades pelo código recebido.',
  },
  {
    pergunta: 'Como funciona o cadastro de um morador?',
    resposta:
      'Um agente registra setor, endereço, contato e as necessidades de transporte, como maca, cadeira de rodas e quantidade de acompanhantes. O sistema gera um código de confirmação.',
  },
  {
    pergunta: 'Para que serve a confirmação do cuidador?',
    resposta:
      'Ela mantém os dados atualizados antes de uma emergência. O cuidador abre a página de confirmação com o código, revisa as necessidades e informa barreiras de acesso, como uma escada na entrada.',
  },
  {
    pergunta: 'O que acontece quando um veículo fica indisponível?',
    resposta:
      'A proposta de viagem é revista. Se não houver alternativa compatível, a pessoa continua na fila com o motivo "Sem recurso compatível", para que o operador peça reforço. O sistema não inventa um substituto.',
  },
  {
    pergunta: 'E se a equipe estiver sem internet?',
    resposta:
      'A equipe usa o programa de campo em Python, que funciona sem rede e exporta os registros. Quando a conexão volta, a central importa os eventos sem duplicar o que já foi registrado.',
  },
  {
    pergunta: 'Embarque significa que a pessoa está segura?',
    resposta:
      'Não. Só contamos como concluído o atendimento com chegada confirmada, que exige destino, responsável e horário.',
  },
  {
    pergunta: 'O que a inteligência artificial faz?',
    resposta:
      'Dois modelos apoiam o planejamento: um estima o impacto histórico registrado em eventos parecidos e outro agrupa domicílios por proximidade. Nenhum deles define prioridade clínica nem calcula rota segura.',
  },
  {
    pergunta: 'Quais são os limites desta demonstração?',
    resposta:
      'Todos os moradores, contatos e coordenadas são fictícios. Não há integração real com e-SUS, WhatsApp, SMS ou gov.br, nem previsão de enchente ou navegação por ruas.',
  },
]
