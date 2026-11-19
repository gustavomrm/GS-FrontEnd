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
  id: number
  setor: { id: number; nome: string }
  nivel: string
  situacao: 'ABERTO' | 'ENCERRADO'
  dataAbertura: string
}

export interface MoradorDaFila {
  id: number
  nome: string
  endereco: string
  contato: string | null
  precisaMaca: boolean
  usaCadeiraRodas: boolean
  qtAcompanhante: number
  barreiraAcesso: string | null
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
  campos?: { campo: string; mensagem: string }[]
}
