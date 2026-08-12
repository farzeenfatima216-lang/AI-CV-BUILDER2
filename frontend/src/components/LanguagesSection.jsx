import React from 'react'

export default function LanguagesSection({ languages = [], setLanguages }) {
  const [input, setInput] = React.useState('')
  const [proficiency, setProficiency] = React.useState('Fluent')

  const addLanguage = () => {
    const name = input.trim()
    if (!name) return
    const next = [...languages, { name, proficiency }]
    setLanguages(next)
    setInput('')
  }

  const removeLanguage = (idx) => {
    const next = languages.filter((_, i) => i !== idx)
    setLanguages(next)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addLanguage()
    }
  }

  return (
    <section className="box-border w-full max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Languages</h3>

      <div className="box-border w-full max-w-full overflow-hidden flex flex-wrap items-start gap-3">
        <div className="flex w-full flex-wrap items-center gap-2">
          {(languages || []).map((l, idx) => (
            <div key={idx} className="min-w-0 flex flex-wrap items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm">
              <span className="min-w-0 break-words">{l.name}{l.proficiency ? ` — ${l.proficiency}` : ''}</span>
              <button
                type="button"
                onClick={() => removeLanguage(idx)}
                className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-white text-rose-600 transition hover:bg-rose-50"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="flex w-full flex-wrap items-center gap-2">
          <input
            value={input}
            onKeyDown={onKeyDown}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add language and press Enter"
            className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
          />
          <select
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value)}
            className="min-w-[120px] rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Fluent</option>
            <option>Native</option>
          </select>
          <button type="button" onClick={addLanguage} className="flex-none inline-flex h-12 items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
            Add
          </button>
        </div>
      </div>
    </section>
  )
}
