import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ErrorFallback } from '@/components/ErrorFallback'
import { StateMessage } from '@/components/StateMessage'

export function MainLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-30 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className="flex-1">
        <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[location.pathname]}>
          <Suspense fallback={<div className="container-page"><StateMessage type="loading" message="Carregando página..." /></div>}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
