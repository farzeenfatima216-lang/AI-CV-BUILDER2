import { BarChart3, Users, LayoutTemplate, Sparkles } from 'lucide-react'

const stats = [
  { label: 'Users', value: '1.2k', icon: Users },
  { label: 'Resumes', value: '8.4k', icon: LayoutTemplate },
  { label: 'AI Usage', value: '96%', icon: Sparkles },
]

export default function Admin() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-violet-600">Admin Panel</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Manage users, templates, and AI usage</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-slate-600">{stat.label}</h3>
                  <div className="rounded-2xl bg-violet-50 p-2 text-violet-700"><Icon className="h-4 w-4" /></div>
                </div>
                <p className="mt-6 text-3xl font-semibold text-slate-900">{stat.value}</p>
              </div>
            )
          })}
        </div>
        <div className="mt-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-slate-900">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Analytics overview</h2>
          </div>
          <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-sm leading-8 text-slate-700">Daily active users, template selection trends, and AI-generated resume volume are shown here for operations and growth planning.</div>
        </div>
      </div>
    </div>
  )
}
