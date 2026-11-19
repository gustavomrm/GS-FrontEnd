export type SituacaoAtendimento =
  | 'AGUARDANDO'
  | 'DESIGNADA'
  | 'EQUIPE_A_CAMINHO'
  | 'EMBARCADA'
  | 'CHEGADA_CONFIRMADA'
  | 'RECUSADO'

export type MotivoPendencia = 'SEM_CONTATO' | 'ACESSO_IMPEDIDO' | 'SEM_RECURSO' | 'SAIDA_PROPRIA_PENDENTE'

export type Marco = 'EQUIPE_A_CAMINHO' | 'EMBARCADA' | 'CHEGADA_CONFIRMADA' | 'RECUSADO' | 'PENDENCIA'

export type NivelAlerta = 'AMARELO' | 'LARANJA' | 'VERMELHO'

export interface Setor {
  id: number
  nome: string
  nivelRisco: string
  referencia: string
}

export interface Morador {
  id: number
  nome: string
  endereco: string
  contato: string | null
  latitude: number | null
  longitude: number | null
  precisaMaca: boolean
  usaCadeiraRodas: boolean
  qtAcompanhante: number
  barreiraAcesso: string | null
  setor: Setor
  situacaoCadastro: string
  dataConfirmacao: string | null
  dataPedidoSaida: string | null
}

export interface NovoMorador {
  idSetor: number
  nome: string
  endereco: string
  contato: string
  precisaMaca: boolean
  usaCadeiraRodas: boolean
  qtAcompanhante: number
  barreiraAcesso: string
  codigoConfirmacao: string
}

export interface Confirmacao {
  contato: string
  precisaMaca: boolean
  usaCadeiraRodas: boolean
  qtAcompanhante: number
  barreiraAcesso: string
}

export interface Alerta {
  id: number
  setor: Setor
  nivel: NivelAlerta
  situacao: 'ABERTO' | 'ENCERRADO'
  dataAbertura: string
  dataEncerramento: string | null
}

export interface NovoAlerta {
  idSetor: number
  nivel: NivelAlerta
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
  tipo: string
  endereco: string
  qtVagas: number
  acessivel: boolean
  disponivel: boolean
}

export interface Atendimento {
  id: number
  alerta: Alerta
  morador: Morador
  situacao: SituacaoAtendimento
  motivoPendencia: MotivoPendencia | null
  veiculo: Veiculo | null
  destino: Destino | null
  responsavel: string | null
  dataDesignacao: string | null
  dataEmbarque: string | null
  dataChegada: string | null
}

export interface Designacao {
  idVeiculo: number
  idDestino: number
  responsavel: string
}

export interface RegistroMarco {
  marco: Marco
  motivoPendencia: MotivoPendencia | null
}

export interface ApiErro {
  status: number
  mensagem: string
  campos: string[] | null
}
