import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">
          AI CV Studio
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link to="/" className="transition hover:text-slate-900">Home</Link>
          <Link to="/templates" className="transition hover:text-slate-900">Templates</Link>
          <Link to="/login" className="transition hover:text-slate-900">Login</Link>
          <Link to="/register" className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700">
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  )
}
