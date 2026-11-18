import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'

const lazyPage = <K extends string>(loader: () => Promise<Record<K, React.ComponentType>>, name: K) =>
  lazy(() => loader().then((module) => ({ default: module[name] })))

const SobrePage = lazyPage(() => import('@/pages/SobrePage'), 'SobrePage')
const FaqPage = lazyPage(() => import('@/pages/FaqPage'), 'FaqPage')
const IntegrantesPage = lazyPage(() => import('@/pages/IntegrantesPage'), 'IntegrantesPage')
const ContatoPage = lazyPage(() => import('@/pages/ContatoPage'), 'ContatoPage')
const OperacaoPage = lazyPage(() => import('@/pages/OperacaoPage'), 'OperacaoPage')
const AtendimentoPage = lazyPage(() => import('@/pages/AtendimentoPage'), 'AtendimentoPage')
const MoradoresPage = lazyPage(() => import('@/pages/MoradoresPage'), 'MoradoresPage')
const ConfirmarPage = lazyPage(() => import('@/pages/ConfirmarPage'), 'ConfirmarPage')
const AnalisesPage = lazyPage(() => import('@/pages/AnalisesPage'), 'AnalisesPage')

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
          <Route path="confirmar" element={<ConfirmarPage />} />
          <Route path="confirmar/:codigo" element={<ConfirmarPage />} />
          <Route path="analises" element={<AnalisesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
