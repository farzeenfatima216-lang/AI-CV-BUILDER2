import { useEffect, useState } from 'react'
import TemplateCard from '../components/TemplateCard'

const templates = [
  { title: 'Modern Template', description: 'Clean, premium layout for startups and tech teams.', accent: 'bg-gradient-to-br from-slate-900 to-violet-700', id: 'modern' },
  { title: 'ATS Template', description: 'Strictly structured format built for recruiter systems.', accent: 'bg-gradient-to-br from-emerald-600 to-slate-700', id: 'ats' },
  { title: 'Creative Template', description: 'Bold visual style for designers and marketers.', accent: 'bg-gradient-to-br from-pink-500 to-orange-400', id: 'creative' },
  { title: 'Professional Template', description: 'Classic and trustworthy for executive roles.', accent: 'bg-gradient-to-br from-blue-600 to-slate-800', id: 'professional' },
  { title: 'Executive Template', description: 'Premium layout with large headings and minimal spacing.', accent: 'bg-gradient-to-br from-slate-500 to-slate-900', id: 'executive' },
]

export default function Templates() {
  const [selected, setSelected] = useState(() => localStorage.getItem('aiResumeBuilderSelectedTemplate') || 'modern')

  useEffect(() => {
    localStorage.setItem('aiResumeBuilderSelectedTemplate', selected)
  }, [selected])

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-violet-600">Templates</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Pick a resume layout that fits your professional story</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              {...template}
              selected={selected === template.id}
              onSelect={() => setSelected(template.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
