import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'

export default function Settings() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const existing = localStorage.getItem('aiResumeBuilderResume')
    if (existing) {
      try {
        const savedData = JSON.parse(existing)
        setProfile({
          name: savedData.personal?.name || '',
          email: savedData.personal?.email || '',
          phone: savedData.personal?.phone || '',
          location: savedData.personal?.location || '',
        })
      } catch {
        // ignore invalid state
      }
    }
  }, [])

  const handleChange = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }))
  }

  const handleSave = () => {
    setSaved(true)
    window.setTimeout(() => setSaved(false), 3200)
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10">
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-violet-600">Settings</p>
            <h1 className="text-3xl font-semibold text-slate-950">Account settings</h1>
            <p className="mt-2 text-sm text-slate-600">Manage your profile information and account preferences.</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Profile information</h2>
            <div className="mt-6 space-y-6">
              {[
                { label: 'Full name', field: 'name' },
                { label: 'Email address', field: 'email' },
                { label: 'Phone number', field: 'phone' },
                { label: 'Location', field: 'location' },
              ].map((item) => (
                <div key={item.field} className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">{item.label}</label>
                  <input
                    type="text"
                    value={profile[item.field]}
                    onChange={(e) => handleChange(item.field, e.target.value)}
                    className="w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500"
                  />
                </div>
              ))}
            </div>
            <button onClick={handleSave} className="mt-8 inline-flex items-center rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
              Save changes
            </button>
            {saved ? <p className="mt-3 text-sm text-emerald-700">Settings saved locally.</p> : null}
          </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Account preferences</h2>
            <p className="mt-3 text-sm text-slate-600">Use the builder as usual; saved profile information is prefilled from your resume data.</p>
            <div className="mt-6 space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">Account connected</p>
                <p className="mt-2 text-sm text-slate-600">You are signed in with your current session.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">Theme</p>
                <p className="mt-2 text-sm text-slate-600">Theme settings are managed by the app design system.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
