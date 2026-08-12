import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { FileText, BadgeCheck, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { dashboardStats } from '../services/api'

const RESUME_LIST_KEY = 'aiResumeBuilderResumeList'
const loadSavedResumes = () => {
  try {
    const saved = localStorage.getItem(RESUME_LIST_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export default function Dashboard() {
  const [stats, setStats] = useState({ resumes: 0, documents: 0, user: 'Member', ats_score: '92%', profile_completion: '87%' })
  const [savedCount, setSavedCount] = useState(0)

  useEffect(() => {
    setSavedCount(loadSavedResumes().length)
    dashboardStats().then(({ data }) => setStats((prev) => ({ ...prev, ...data }))).catch(() => {})
  }, [])

  const totalResumes = savedCount > 0 ? savedCount : stats.resumes
  const cards = [
    { title: 'Total Resumes', value: totalResumes, icon: FileText },
    { title: 'ATS Friendly', value: stats.ats_score || '92%', icon: BadgeCheck },
    { title: 'Profile Completion', value: stats.profile_completion || '87%', icon: TrendingUp },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10">
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-violet-600">Dashboard</p>
            <h1 className="text-3xl font-semibold text-slate-950">Welcome back, {stats.user}</h1>
          </div>
          <Link to="/builder" className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white">Create new resume</Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-slate-600">{card.title}</h3>
                  <div className="rounded-2xl bg-violet-50 p-2 text-violet-700">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-6 text-3xl font-semibold text-slate-900">{card.value}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Recent activity</h2>
            <div className="mt-6 space-y-4">
              {['Resume updated for a Senior Product role', 'AI summary generated for your profile', 'ATS score improved from 81 to 92'].map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">{item}</div>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-900 via-violet-900 to-slate-700 p-6 text-white shadow-sm">
            <h2 className="text-xl font-semibold">Resume health</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">Your profile is strong and ready for a new role. We recommend adding leadership and project metrics.</p>
            <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm">AI recommendations ready</div>
          </div>
        </div>
      </main>
    </div>
  )
}
