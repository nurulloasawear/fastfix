import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { useJobNotifier } from '@/features/products/hooks/useJobNotifier'

export function AppLayout() {
  useJobNotifier() // notify when an AI-import batch finishes, on any page
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-bg">
        <Outlet />
      </main>
    </div>
  )
}
