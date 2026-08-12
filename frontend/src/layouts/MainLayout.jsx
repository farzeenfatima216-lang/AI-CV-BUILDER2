import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <main className="w-full max-w-4xl p-6">
        <Outlet />
      </main>
    </div>
  )
}
