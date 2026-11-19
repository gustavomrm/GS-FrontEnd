import type { ApiErro } from '@/types/api'

const API_URL = import.meta.env.VITE_API_URL || 'https://saida-assistida-api.onrender.com'

export class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function lerMensagemDeErro(response: Response): Promise<string> {
  const erro: ApiErro | null = await response.json().catch(() => null)
  if (erro && erro.campos && erro.campos.length > 0) {
    return `${erro.mensagem}: ${erro.campos.join(', ')}`
  }
  if (erro && erro.mensagem) {
    return erro.mensagem
  }
  return `Falha na requisição: ${response.status}`
}

export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new HttpError(response.status, await lerMensagemDeErro(response))
  }

  return response.json()
}

export async function httpDelete(path: string): Promise<void> {
  const response = await fetch(`${API_URL}${path}`, { method: 'DELETE' })

  if (!response.ok) {
    throw new HttpError(response.status, await lerMensagemDeErro(response))
  }
}
