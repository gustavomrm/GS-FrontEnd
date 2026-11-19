import { useMemo, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StateMessage } from '@/components/StateMessage'
import { MoradorForm } from '@/components/MoradorForm'
import { Feedback } from '@/components/Feedback'
import { useApi } from '@/hooks/useApi'
import { deleteMorador, getMoradores } from '@/services/moradores'
import { getSetores } from '@/services/setores'
import type { Morador } from '@/types/api'
import { formatDateTime, necessidades } from '@/utils/format'

export function MoradoresPage() {
  const moradores = useApi(getMoradores, [])
  const setores = useApi(getSetores, [])
  const [editando, setEditando] = useState<Morador | null>(null)
  const [busca, setBusca] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [removendo, setRemovendo] = useState<number | null>(null)

  const filtrados = useMemo(
    () => (moradores.data ?? []).filter((m) => m.nome.toLowerCase().includes(busca.trim().toLowerCase())),
    [moradores.data, busca],
  )

  async function handleRemover(morador: Morador) {
    if (!window.confirm(`Remover ${morador.nome}? Esta ação não pode ser desfeita.`)) return
    setRemovendo(morador.idMorador)
    setFeedback(null)
    try {
      await deleteMorador(morador.idMorador)
      setFeedback({ type: 'success', message: `${morador.nome} removido da central.` })
      if (editando?.idMorador === morador.idMorador) setEditando(null)
      moradores.reload()
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message })
    } finally {
      setRemovendo(null)
    }
  }

  const nomeSetor = (id: number) => setores.data?.find((s) => s.idSetor === id)?.nome ?? `Setor ${id}`

  return (
    <div className="container-page">
      <PageHeader
        title="Moradores que precisam de apoio"
        description="Cadastro feito por agentes, com necessidades de transporte e barreiras de acesso. Todos os dados são fictícios."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="busca" className="text-sm font-semibold">
              Buscar por nome
            </label>
            <input
              id="busca"
              type="search"
              className="input"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Digite um nome"
            />
          </div>

          {feedback && <Feedback type={feedback.type} message={feedback.message} />}

          {moradores.loading && <StateMessage type="loading" message="Carregando moradores..." />}
          {moradores.error && <StateMessage type="error" message={moradores.error} onRetry={moradores.reload} />}
          {!moradores.loading && !moradores.error && filtrados.length === 0 && (
            <StateMessage type="empty" message={busca ? 'Nenhum morador com esse nome.' : 'Nenhum morador cadastrado.'} />
          )}

          {!moradores.loading && !moradores.error && filtrados.length > 0 && (
            <ul className="flex flex-col gap-3">
              {filtrados.map((morador) => (
                <li key={morador.idMorador} className="card flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-semibold">{morador.nome}</h2>
                    <p className="text-sm text-slate-600">
                      {nomeSetor(morador.idSetor)} · {morador.logradouro}, {morador.numero}
                    </p>
                    <p className="text-sm text-slate-600">{necessidades(morador).join(', ')}</p>
                    <p className="text-xs text-slate-500">
                      Código {morador.codigoConfirmacao} · Confirmado em {formatDateTime(morador.dtConfirmacao)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn-secondary px-3"
                      aria-label={`Editar ${morador.nome}`}
                      onClick={() => {
                        setEditando(morador)
                        setFeedback(null)
                      }}
                    >
                      <Pencil size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="btn-secondary px-3 text-red-700"
                      aria-label={`Remover ${morador.nome}`}
                      disabled={removendo === morador.idMorador}
                      onClick={() => handleRemover(morador)}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <MoradorForm
          key={editando?.idMorador ?? 'novo'}
          setores={setores.data ?? []}
          editando={editando}
          onSaved={() => {
            moradores.reload()
          }}
          onCancel={() => setEditando(null)}
        />
      </div>
    </div>
  )
}
