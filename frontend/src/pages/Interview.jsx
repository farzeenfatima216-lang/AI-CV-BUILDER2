import { useState } from 'react'
import { MessageCircleMore, Sparkles } from 'lucide-react'
import { analyzeAts } from '../services/api'

export default function Interview() {
  const [text, setText] = useState('I led a cross-functional product launch, improved onboarding conversion, and built a strong design system.')
  const [result, setResult] = useState('Paste your resume summary to get ATS insights and interview-ready guidance.')

  const handleAnalyze = async () => {
    try {
      const { data } = await analyzeAts({ text })
      setResult(`ATS Score: ${data.ats_score}\n\nSuggestions:\n- ${data.suggestions.join('\n- ')}`)
    } catch (err) {
      setResult('Unable to analyze your resume right now.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-violet-600">AI Feature</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Interview Question Generator</h1>
          </div>
          <div className="rounded-full bg-violet-50 p-3 text-violet-700">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-slate-50 p-6">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <MessageCircleMore className="h-4 w-4" /> Prepare for recruiter conversations
            </div>
            <textarea value={text} onChange={(e) => setText(e.target.value)} className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" rows="6" />
            <button onClick={handleAnalyze} className="mt-4 rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white">Analyze</button>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-sm leading-8 text-slate-300 whitespace-pre-wrap">
            {result}
          </div>
        </div>
      </div>
    </div>
  )
}
