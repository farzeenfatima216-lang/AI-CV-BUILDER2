import React from 'react'

export default function AchievementsSection({ achievements, setAchievements }) {
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')

  const addAchievement = () => {
    const t = title.trim()
    if (!t) return
    const next = [...(achievements || []), { title: t, description: description.trim() }]
    setAchievements(next)
    setTitle('')
    setDescription('')
  }

  const removeAchievement = (idx) => {
    const next = (achievements || []).filter((_, i) => i !== idx)
    setAchievements(next)
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Achievements (optional)</h3>
          <p className="mt-1 text-sm text-slate-500">Add notable accomplishments that support your career story.</p>
        </div>
        <button type="button" onClick={addAchievement} className="inline-flex h-12 items-center justify-center rounded-full bg-violet-600 px-5 text-sm font-semibold text-white transition duration-200 hover:bg-violet-700">Add Achievement</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none" rows={3} />
      </div>
      <div className="text-right text-xs text-slate-500">{description.length}/1000</div>
      <div className="space-y-3 pt-4">
        {(achievements || []).map((a, idx) => (
          <div key={idx} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">{a.title}</div>
                {a.description ? <div className="mt-1 text-sm text-slate-600">{a.description}</div> : null}
              </div>
              <button onClick={() => removeAchievement(idx)} className="text-sm font-medium text-violet-600 transition hover:text-violet-700">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
