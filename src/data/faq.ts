export const perguntas = [
  {
    pergunta: 'Quem usa o Saída Assistida?',
    resposta:
      'A Defesa Civil municipal opera a central. Agentes cadastram moradores que precisam de apoio, e moradores ou cuidadores confirmam as necessidades com o código recebido.',
  },
  {
    pergunta: 'Como funciona o cadastro de um morador?',
    resposta:
      'O agente informa setor, endereço, contato, as necessidades de transporte (maca, cadeira de rodas e acompanhantes) e um código de confirmação, que é entregue ao cuidador.',
  },
  {
    pergunta: 'Para que serve a confirmação do cuidador?',
    resposta:
      'Ela mantém os dados atualizados antes de uma emergência. O cuidador abre a página de confirmação com o código, revisa as necessidades e informa barreiras de acesso, como uma escada na entrada.',
  },
  {
    pergunta: 'O que acontece quando não há veículo disponível?',
    resposta:
      'O operador só consegue designar veículos e destinos disponíveis. Se nenhum servir, ele registra a pendência "Sem recurso compatível" e a pessoa continua na fila até chegar um reforço.',
  },
  {
    pergunta: 'E se a equipe estiver sem internet?',
    resposta:
      'A equipe usa o programa de campo em Python, que funciona sem rede e exporta os registros. Quando a conexão volta, a central importa os eventos sem duplicar o que já foi registrado.',
  },
  {
    pergunta: 'Embarque significa que a pessoa está segura?',
    resposta:
      'Não. Só contamos como concluído o atendimento com chegada confirmada, que tem veículo, destino, responsável e horário registrados.',
  },
  {
    pergunta: 'O que a inteligência artificial faz?',
    resposta:
      'Na disciplina de IA, dois modelos apoiam o planejamento: um estima o impacto histórico de eventos parecidos e outro agrupa domicílios próximos. Nenhum deles define prioridade clínica nem calcula rota segura.',
  },
  {
    pergunta: 'Quais são os limites desta demonstração?',
    resposta:
      'Todos os moradores, contatos e endereços são fictícios. Não há integração real com e-SUS, WhatsApp, SMS ou gov.br, nem previsão de enchente ou navegação por ruas.',
  },
]
