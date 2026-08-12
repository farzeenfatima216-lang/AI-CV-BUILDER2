import { useState } from 'react'
import { motion } from 'framer-motion'
import CVForm from '../components/CVForm'
import CVPreview from '../components/CVPreview'

export default function Builder() {
  const [data, setData] = useState(() => ({
    personal: {},
    summary: '',
    skills: [],
    education: [],
    experience: [],
    projects: [],
    languages: [],
    achievements: [],
    references: [],
    selectedTemplate: localStorage.getItem('aiResumeBuilderSelectedTemplate') || 'modern',
  }))

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-violet-600">CV Builder</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Create a polished resume with AI assistance</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">Organize your CV content, switch templates instantly, and preview exactly how your resume will look on export.</p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
            <CVForm onDataChange={setData} />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="relative">
            <div className="sticky top-6">
              <CVPreview data={data} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
