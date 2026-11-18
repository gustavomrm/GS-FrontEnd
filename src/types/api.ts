export type EstadoAtendimento =
  | 'AGUARDANDO'
  | 'DESIGNADA'
  | 'EQUIPE_A_CAMINHO'
  | 'EMBARCADA'
  | 'CHEGADA_CONFIRMADA'

export type MotivoPendencia =
  | 'SEM_CONTATO'
  | 'ACESSO_IMPEDIDO'
  | 'SEM_RECURSO'
  | 'SAIDA_PROPRIA_PENDENTE'

export interface Setor {
  idSetor: number
  nome: string
  nivelRisco: string
}

export interface Morador {
  idMorador: number
  idSetor: number
  nome: string
  logradouro: string
  numero: string
  telefone: string
  latitude: number
  longitude: number
  precisaMaca: boolean
  precisaCadeira: boolean
  qtAcompanhante: number
  observacaoAcesso: string | null
  codigoConfirmacao: string
  dtConfirmacao: string | null
}

export type MoradorInput = Omit<Morador, 'idMorador' | 'codigoConfirmacao' | 'dtConfirmacao'>

export interface ConfirmacaoInput {
  precisaMaca: boolean
  precisaCadeira: boolean
  qtAcompanhante: number
  observacaoAcesso: string | null
}

export interface Alerta {
  idAlerta: number
  idSetor: number
  nivel: string
  situacao: 'ATIVO' | 'ENCERRADO'
  dtAbertura: string
  dtEncerramento: string | null
}

export interface AlertaInput {
  idSetor: number
  nivel: string
}

export interface Atendimento {
  idAtendimento: number
  idAlerta: number
  idViagem: number | null
  morador: Morador
  prioridade: number
  estado: EstadoAtendimento
  motivoPendencia: MotivoPendencia | null
  versao: number
}

export interface Historico {
  idHistorico: number
  estadoAnterior: EstadoAtendimento | null
  estadoNovo: EstadoAtendimento
  motivoPendencia: MotivoPendencia | null
  instante: string
  responsavel: string
  origem: 'CENTRAL' | 'CAMPO'
}

export interface EventoInput {
  idEvento: string
  estado: EstadoAtendimento
  motivoPendencia: MotivoPendencia | null
  responsavel: string
  origem: 'CENTRAL'
  versaoBase: number
}

export interface Veiculo {
  idVeiculo: number
  identificacao: string
  tipo: string
  qtAssentos: number
  qtCadeiras: number
  qtMacas: number
  disponivel: boolean
}

export interface Proposta {
  idVeiculo: number
  idEquipe: number
  idDestino: number
  veiculo: string
  equipe: string
  destino: string
  idsAtendimento: number[]
  justificativa: string
}

export interface PropostaResultado {
  propostas: Proposta[]
  semRecurso: { idAtendimento: number; nome: string; motivo: string }[]
}

export interface Viagem {
  idViagem: number
  idVeiculo: number
  idEquipe: number
  idDestino: number
  situacao: string
}

export interface ViagemInput {
  idAlerta: number
  idVeiculo: number
  idEquipe: number
  idDestino: number
  idsAtendimento: number[]
}

export interface ImpactoInput {
  municipio: string
  tipoEvento: string
  mes: number
}

export interface ImpactoResultado {
  estimativa: number
  unidade: string
  versaoModelo: string
  periodoTreinamento: string
  aviso: string
}

export interface AgrupamentoResultado {
  versaoModelo: string
  aviso: string
  grupos: { grupo: number; quantidade: number; idsAtendimento: number[] }[]
}

export interface ApiErro {
  status: number
  mensagem: string
  instante: string
  caminho: string
  campos?: { campo: string; mensagem: string }[]
}
