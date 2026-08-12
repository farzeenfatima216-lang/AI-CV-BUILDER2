import { useState } from 'react'
import { Sparkles, FileText } from 'lucide-react'
import { generateCoverLetter } from '../services/api'

export default function CoverLetter() {
  const [form, setForm] = useState({ role: 'Senior Product Designer', company: 'Northstar Labs', name: 'Avery Carter' })
  const [result, setResult] = useState('Generate a tailored letter to see it here.')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setError('')
    setLoading(true)
    try {
      const { data } = await generateCoverLetter(form)
      setResult(data.cover_letter || data.result || 'Unable to generate a cover letter right now.')
    } catch (err) {
      setError('Unable to generate a cover letter right now.')
      setResult('Unable to generate a cover letter right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-violet-600">AI Feature</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Cover Letter Generator</h1>
          </div>
          <div className="rounded-full bg-violet-50 p-3 text-violet-700">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4 rounded-3xl bg-slate-50 p-6">
            <label className="block text-sm font-medium text-slate-700">Your name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" placeholder="Avery Carter" />
            <label className="block text-sm font-medium text-slate-700">Job title</label>
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" placeholder="Senior Product Designer" />
            <label className="block text-sm font-medium text-slate-700">Company</label>
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" placeholder="Northstar Labs" />
            <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60 disabled:cursor-not-allowed">
              <FileText className="h-4 w-4" /> {loading ? 'Generating...' : 'Generate cover letter'}
            </button>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-sm leading-8 text-slate-300 whitespace-pre-wrap">
            {error ? <span className="text-rose-200">{error}</span> : result}
          </div>
        </div>
      </div>
    </div>
  )
}
