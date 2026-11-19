import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StateMessage } from '@/components/StateMessage'
import { Feedback } from '@/components/Feedback'
import { Necessidades } from '@/components/Necessidades'
import { deleteMorador, getMoradores } from '@/services/moradores'
import { HttpError } from '@/services/http'
import type { Morador } from '@/types/api'
import { formatarData } from '@/utils/format'

export function MoradoresPage() {
  const location = useLocation()
  const avisoCadastro: string | null = location.state
  const [moradores, setMoradores] = useState<Morador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busca, setBusca] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erroRemocao, setErroRemocao] = useState('')

  useEffect(() => {
    let active = true

    getMoradores()
      .then((data) => {
        if (active) setMoradores(data)
      })
      .catch(() => {
        if (active) setError('Não foi possível carregar os moradores.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const filtrados = useMemo(
    () => moradores.filter((morador) => morador.nome.toLowerCase().includes(busca.toLowerCase())),
    [moradores, busca],
  )

  async function handleRemover(morador: Morador) {
    setMensagem('')
    setErroRemocao('')
    try {
      await deleteMorador(morador.id)
      setMoradores((prev) => prev.filter((item) => item.id !== morador.id))
      setMensagem(`${morador.nome} foi removido da central.`)
    } catch (error) {
      if (error instanceof HttpError) {
        setErroRemocao(error.message)
      } else {
        setErroRemocao('Não foi possível conectar à API.')
      }
    }
  }

  return (
    <div className="container-page">
      <PageHeader
        title="Moradores que precisam de apoio"
        description="Cadastro feito por agentes, com necessidades de transporte e barreiras de acesso. Todos os dados são fictícios."
      >
        <Link to="/moradores/novo" className="btn-primary">
          Cadastrar morador
        </Link>
      </PageHeader>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="busca" className="text-sm font-semibold">
            Buscar por nome
          </label>
          <input
            id="busca"
            type="search"
            className="field sm:max-w-sm"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Digite um nome"
          />
        </div>

        {avisoCadastro && !mensagem && <Feedback type="success" message={avisoCadastro} />}
        {mensagem && <Feedback type="success" message={mensagem} />}
        {erroRemocao && <Feedback type="error" message={erroRemocao} />}

        {error && <StateMessage type="error" message={error} />}
        {!error && loading && <StateMessage type="loading" message="Carregando moradores..." />}
        {!error && !loading && filtrados.length === 0 && (
          <StateMessage type="empty" message="Nenhum morador encontrado." />
        )}

        {!error && !loading && filtrados.length > 0 && (
          <ul className="grid gap-3 md:grid-cols-2">
            {filtrados.map((morador) => (
              <li key={morador.id} className="card flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold">{morador.nome}</h2>
                    <p className="text-sm text-slate-600">{morador.endereco}</p>
                    <p className="text-sm text-slate-600">{morador.setor.nome}</p>
                  </div>
                  <button
                    type="button"
                    className="btn-secondary px-3 text-red-700"
                    aria-label={`Remover ${morador.nome}`}
                    onClick={() => handleRemover(morador)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <Necessidades morador={morador} />
                <p className="text-xs text-slate-500">Confirmado em: {formatarData(morador.dataConfirmacao)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
