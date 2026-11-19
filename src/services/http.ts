import type { ApiErro } from '@/types/api'

const API_URL = import.meta.env.VITE_API_URL || 'https://saida-assistida-api.onrender.com'

export class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    let mensagem = `Falha na requisição: ${response.status}`
    try {
      const erro: ApiErro = await response.json()
      mensagem = erro.mensagem
      if (erro.campos) {
        mensagem = `${erro.mensagem}: ${erro.campos.join(', ')}`
      }
    } catch {
      // a resposta de erro veio sem JSON, fica a mensagem padrão
    }
    throw new HttpError(response.status, mensagem)
  }

  if (response.status === 204) {
    return null as T
  }

  return response.json()
}
