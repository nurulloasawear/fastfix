import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'
import { PasswordGate } from '@/components/PasswordGate'
import '@/styles/tokens.css'
import { env } from '@/config/env' // yoki env.ts qayerda bo'lsa

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  const last = Number(sessionStorage.getItem('chunkReloadAt') ?? '0')
  if (Date.now() - last < 10_000) return
  sessionStorage.setItem('chunkReloadAt', String(Date.now()))
  window.location.reload()
})

async function bootstrap() {
  // Endi .env emas, env.ts dagi qiymat ishlatiladi
  if (import.meta.env.DEV && env.enableMsw) {
    const { startMockWorker } = await import('@/mocks/browser')
    await startMockWorker()
  }

  const rootEl = document.getElementById('root')
  if (!rootEl) throw new Error('#root element not found')

  createRoot(rootEl).render(
    <StrictMode>
      <PasswordGate>
        <App />
      </PasswordGate>
    </StrictMode>,
  )
}

void bootstrap()
