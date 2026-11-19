# Saída Assistida

SPA da Global Solution 2026/2 (FIAP, 1TDS) para a disciplina Front-End Design Engineering.

## Objetivo

Ajudar a Defesa Civil municipal a preparar e coordenar a evacuação de pessoas que precisam de apoio (idosos, acamados e pessoas com deficiência), com alocação de veículo, equipe e destino compatíveis e acompanhamento até a chegada confirmada. Os dados são todos fictícios.

## Tecnologias

- React 19 + Vite + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React Router (rotas estáticas e dinâmicas)
- React Hook Form (validação dos formulários)
- Fetch API para consumir a API Java (sem Axios)
- lucide-react e react-error-boundary

## Páginas

| Rota | Conteúdo |
| --- | --- |
| `/` | Home: problema, público e proposta |
| `/integrantes` | Integrantes do grupo |
| `/sobre` | Como funciona, ODS e limites |
| `/faq` | Perguntas frequentes |
| `/contato` | Formulário de contato validado |
| `/operacao` | Abertura de alertas, inclusão na fila e consulta dos veículos |
| `/atendimentos/:id` | Designação de transporte, marcos e horários registrados |
| `/moradores` | Lista, busca e remoção de moradores |
| `/moradores/novo` | Cadastro de morador com validação |
| `/confirmar` | Cuidador digita o código de confirmação |
| `/confirmar/:codigo` | Cuidador revisa e confirma as necessidades |
| `/analises` | Contagem de atendimentos por situação e pendência, com filtro por alerta |

## Estrutura

```
src/
  components/   componentes reutilizáveis (FormField, StatusBadge, StateMessage, Feedback...)
  data/         textos fixos (integrantes, FAQ)
  hooks/        useSetores, useVeiculos e useDestinos
  layouts/      MainLayout com Header, Outlet e Footer
  pages/        uma página por rota
  services/     chamadas à API Java com fetch
  types/        tipos e interfaces da API
  utils/        formatação de datas e nomes das situações
```

## Como executar

```bash
npm install
npm run dev
```

A aplicação abre em http://localhost:5173 e já usa a API Java publicada. Para usar outra API, copie o `.env.example` para `.env` e troque o `VITE_API_URL` (sem barra no final).

## Links

- GitHub: https://github.com/gustavomrm/GS-FrontEnd
- Vercel: https://SEU-PROJETO.vercel.app
- API Java: https://saida-assistida-api.onrender.com
- YouTube: https://youtu.be/VIDEO

## Integração com a API Java

| Tela | Método e rota |
| --- | --- |
| Operação | `GET /alertas`, `POST /alertas`, `GET /alertas/{id}/atendimentos`, `GET /setores`, `GET /veiculos`, `GET /alertas/{id}/elegiveis`, `POST /alertas/{id}/atendimentos` |
| Atendimento | `GET /atendimentos/{id}`, `GET /veiculos`, `GET /destinos`, `PUT /atendimentos/{id}/designacao`, `PUT /atendimentos/{id}/marcos` |
| Moradores | `GET /setores`, `GET /moradores`, `POST /moradores`, `DELETE /moradores/{id}` |
| Confirmar | `GET /confirmacoes/{codigo}`, `PUT /confirmacoes/{codigo}` |
| Análises | `GET /alertas`, `GET /atendimentos` |

Toda tela mostra carregamento, erro da requisição e ausência de dados. Nos formulários, os erros da API (400, 404, 409) aparecem com a mensagem devolvida pelo backend.

## Integrantes

| Nome | RM | Turma | GitHub |
| --- | --- | --- | --- |
| Carlos Eduardo Oliveira Silva | 569103 | 1TDSPV | ceduardoos |
| Gustavo Mendes da Rosa Moreira | 565807 | 1TDSPV | gustavomrm |
| Leonardo de Souza Bernardo | 570951 | 1TDSPV | bernardleonardo |
| Luiz Gustavo Albuquerque B. Guedes | 565843 | 1TDSPV | oLuizGuedes |

## Contato

saidaassistida.fiap@gmail.com

## Uso de IA

Usamos o Claude (Anthropic) e o ChatGPT/Codex (OpenAI) como apoio para estruturar o projeto, revisar o código, integrar a API e explicar erros. Todo o código foi revisado e testado pelo grupo.
