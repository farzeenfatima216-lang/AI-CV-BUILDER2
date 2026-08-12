import React from 'react'

export default function ReferencesSection({ referencesMode, setReferencesMode, references, setReferences }) {
  const emptyRef = { name: '', position: '', company: '', email: '', phone: '' }

  const addReference = () => {
    setReferences([...(references || []), { ...emptyRef }])
  }

  const updateReference = (idx, field, value) => {
    const next = (references || []).map((r, i) => (i === idx ? { ...r, [field]: value } : r))
    setReferences(next)
  }

  const removeReference = (idx) => {
    setReferences((references || []).filter((_, i) => i !== idx))
  }

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">References (optional)</h3>
          <p className="mt-1 text-sm text-slate-500">Choose whether to include manual references or keep them available upon request.</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <label className={`rounded-full border px-4 py-3 text-sm transition ${referencesMode === 'request' ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-slate-200 bg-white text-slate-700'}`}>
          <input type="radio" name="refs" checked={referencesMode === 'request'} onChange={() => setReferencesMode('request')} className="mr-2" />
          Available upon request
        </label>
        <label className={`rounded-full border px-4 py-3 text-sm transition ${referencesMode === 'manual' ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-slate-200 bg-white text-slate-700'}`}>
          <input type="radio" name="refs" checked={referencesMode === 'manual'} onChange={() => setReferencesMode('manual')} className="mr-2" />
          Provide references
        </label>
      </div>

      {referencesMode === 'manual' && (
        <div className="space-y-3">
          {(references || []).map((r, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="grid gap-3 md:grid-cols-2">
                <input placeholder="Name" value={r.name} onChange={(e) => updateReference(idx, 'name', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2" />
                <input placeholder="Position" value={r.position} onChange={(e) => updateReference(idx, 'position', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2" />
                <input placeholder="Company" value={r.company} onChange={(e) => updateReference(idx, 'company', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2" />
                <input placeholder="Email" value={r.email} onChange={(e) => updateReference(idx, 'email', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2" />
                <input placeholder="Phone" value={r.phone} onChange={(e) => updateReference(idx, 'phone', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2" />
              </div>
              <div className="mt-2 text-right">
                <button onClick={() => removeReference(idx)} className="text-rose-600">Remove</button>
              </div>
            </div>
          ))}
          <div>
            <button type="button" onClick={addReference} className="rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white">Add Reference</button>
          </div>
        </div>
      )}
    </section>
  )
}
