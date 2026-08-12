import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, PenTool, Sparkles, BadgeCheck, MessagesSquare, Settings, Shield, Globe2, LogOut } from 'lucide-react'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/resumes', label: 'My Resumes', icon: FileText },
  { to: '/builder', label: 'Create Resume', icon: PenTool },
  { to: '/templates', label: 'Templates', icon: Sparkles },
  { to: '/cover-letter', label: 'Cover Letter', icon: BadgeCheck },
  { to: '/linkedin', label: 'LinkedIn Profile', icon: Globe2 },
  { to: '/interview', label: 'Interview Prep', icon: MessagesSquare },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-slate-950 p-6 text-slate-200 lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-white/10 p-2">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold">AI CV Studio</p>
          <p className="text-xs text-slate-400">Workspace</p>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${active ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-8 flex w-full items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  )
}
