import { useState } from 'react'
import { Sparkles, PenTool } from 'lucide-react'
import { generateLinkedInAbout } from '../services/api'

export default function LinkedIn() {
  const [form, setForm] = useState({ name: 'Avery Carter', summary: 'product strategy and modern SaaS delivery' })
  const [result, setResult] = useState('Generate a polished LinkedIn summary to see it here.')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setError('')
    setLoading(true)
    try {
      const { data } = await generateLinkedInAbout(form)
      setResult(data.linkedin_about || data.result || 'Unable to generate a LinkedIn summary right now.')
    } catch (err) {
      setError('Unable to generate a LinkedIn summary right now.')
      setResult('Unable to generate a LinkedIn summary right now.')
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
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">LinkedIn About Generator</h1>
          </div>
          <div className="rounded-full bg-violet-50 p-3 text-violet-700">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <PenTool className="h-4 w-4" /> Tailored professional bio for your profile
          </div>
          <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" rows="3" />
          <div className="mt-4 flex items-center gap-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" placeholder="Your name" />
            <button disabled={loading} onClick={handleGenerate} className="rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
          <p className="mt-6 text-sm leading-8 text-slate-700 whitespace-pre-wrap">{error ? <span className="text-rose-600">{error}</span> : result}</p>
        </div>
      </div>
    </div>
  )
}
