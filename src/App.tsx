import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { HomePage } from '@/pages/HomePage'
import { SobrePage } from '@/pages/SobrePage'
import { FaqPage } from '@/pages/FaqPage'
import { IntegrantesPage } from '@/pages/IntegrantesPage'
import { ContatoPage } from '@/pages/ContatoPage'
import { OperacaoPage } from '@/pages/OperacaoPage'
import { MoradoresPage } from '@/pages/MoradoresPage'
import { NovoMoradorPage } from '@/pages/NovoMoradorPage'
import { ConfirmarPage } from '@/pages/ConfirmarPage'
import { ConfirmacaoPage } from '@/pages/ConfirmacaoPage'
import { AnalisesPage } from '@/pages/AnalisesPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

const AtendimentoPage = lazy(() =>
  import('@/pages/AtendimentoPage').then((module) => ({ default: module.AtendimentoPage })),
)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="sobre" element={<SobrePage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="integrantes" element={<IntegrantesPage />} />
          <Route path="contato" element={<ContatoPage />} />
          <Route path="operacao" element={<OperacaoPage />} />
          <Route path="atendimentos/:id" element={<AtendimentoPage />} />
          <Route path="moradores" element={<MoradoresPage />} />
          <Route path="moradores/novo" element={<NovoMoradorPage />} />
          <Route path="confirmar" element={<ConfirmarPage />} />
          <Route path="confirmar/:codigo" element={<ConfirmacaoPage />} />
          <Route path="analises" element={<AnalisesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
