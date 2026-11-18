import type { ApiErro } from '@/types/api'

export const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export class HttpError extends Error {
  status: number
  campos: ApiErro['campos']

  constructor(status: number, message: string, campos?: ApiErro['campos']) {
    super(message)
    this.status = status
    this.campos = campos
  }
}

const mensagensPadrao: Record<number, string> = {
  400: 'Dados inválidos. Revise os campos e tente novamente.',
  404: 'Registro não encontrado.',
  405: 'Operação não permitida.',
  409: 'A operação entra em conflito com uma regra do atendimento.',
  500: 'O servidor encontrou um erro inesperado.',
}

export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!API_URL) {
    throw new HttpError(0, 'A URL da API Java não foi configurada (VITE_API_URL).')
  }

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init.headers },
    })
  } catch {
    throw new HttpError(0, 'Não foi possível conectar à API. Verifique sua conexão e tente de novo.')
  }

  if (!response.ok) {
    let corpo: Partial<ApiErro> = {}
    try {
      corpo = await response.json()
    } catch {
      corpo = {}
    }
    const mensagem = corpo.mensagem ?? mensagensPadrao[response.status] ?? `Erro ${response.status}`
    throw new HttpError(response.status, mensagem, corpo.campos)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function body(data: unknown): Pick<RequestInit, 'body'> {
  return { body: JSON.stringify(data) }
}
