export type EstadoAtendimento =
  | 'AGUARDANDO'
  | 'DESIGNADA'
  | 'EQUIPE_A_CAMINHO'
  | 'EMBARCADA'
  | 'CHEGADA_CONFIRMADA'
  | 'RECUSADO'

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

export interface ConfirmacaoInput {
  contato: string | null
  precisaMaca: boolean
  usaCadeiraRodas: boolean
  qtAcompanhante: number
  barreiraAcesso: string | null
}

export interface MoradorInput extends ConfirmacaoInput {
  nome: string
  endereco: string
  idSetor: number
  latitude: number
  longitude: number
}

export interface MoradorCadastroInput extends MoradorInput {
  codigoConfirmacao: string
}

export interface MoradorDaFila extends ConfirmacaoInput {
  id: number
  nome: string
  endereco: string
}

export interface Morador extends MoradorDaFila {
  setor: { id: number; nome: string }
  latitude: number
  longitude: number
  dataConfirmacao: string | null
  situacaoCadastro: string
  dataPedidoSaida: string | null
}

export interface Alerta {
  id: number
  setor: { id: number; nome: string }
  nivel: string
  situacao: 'ABERTO' | 'ENCERRADO'
  dataAbertura: string
}

export interface Veiculo {
  id: number
  nome: string
  tipo: string
  qtAssentos: number
  qtCadeiras: number
  qtMacas: number
  disponivel: boolean
}

export interface Destino {
  id: number
  nome: string
  disponivel: boolean
}

export interface Atendimento {
  id: number
  alerta: Alerta
  morador: MoradorDaFila
  situacao: EstadoAtendimento
  motivoPendencia: MotivoPendencia | null
  veiculo: Veiculo | null
  destino: Destino | null
  responsavel: string | null
  dataDesignacao: string | null
  dataEmbarque: string | null
  dataChegada: string | null
}

export interface ApiErro {
  status: number
  mensagem: string
  instante: string
  caminho: string
  campos?: string[] | null
}
