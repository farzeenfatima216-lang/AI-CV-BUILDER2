import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import Sidebar from '../components/Sidebar'

const RESUME_LIST_KEY = 'aiResumeBuilderResumeList'
const CURRENT_RESUME_KEY = 'aiResumeBuilderResume'
const CURRENT_RESUME_ID_KEY = 'aiResumeBuilderResumeId'
const SELECTED_TEMPLATE_KEY = 'aiResumeBuilderSelectedTemplate'

const loadSavedResumes = () => {
  try {
    const saved = localStorage.getItem(RESUME_LIST_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const formatDate = (isoValue) => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(isoValue))
  } catch {
    return isoValue
  }
}

export default function MyResumes() {
  const [resumes, setResumes] = useState([])
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    setResumes(loadSavedResumes())
  }, [])

  const openResume = (resume) => {
    localStorage.setItem(CURRENT_RESUME_KEY, JSON.stringify(resume.data))
    localStorage.setItem(CURRENT_RESUME_ID_KEY, resume.id)
    if (resume.data?.selectedTemplate) {
      localStorage.setItem(SELECTED_TEMPLATE_KEY, resume.data.selectedTemplate)
    }
    navigate('/builder')
  }

  const deleteResume = (id) => {
    const next = resumes.filter((resume) => resume.id !== id)
    setResumes(next)
    localStorage.setItem(RESUME_LIST_KEY, JSON.stringify(next))
    const currentId = localStorage.getItem(CURRENT_RESUME_ID_KEY)
    if (currentId === id) {
      localStorage.removeItem(CURRENT_RESUME_KEY)
      localStorage.removeItem(CURRENT_RESUME_ID_KEY)
    }
    setMessage('Resume deleted successfully.')
    window.setTimeout(() => setMessage(''), 3200)
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10">
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-violet-600">My Resumes</p>
            <h1 className="text-3xl font-semibold text-slate-950">Saved resumes</h1>
            <p className="mt-2 text-sm text-slate-600">Manage your saved resumes and continue editing them anytime.</p>
          </div>
        </div>

        {message ? (
          <div className="mb-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {message}
          </div>
        ) : null}

        {resumes.length === 0 ? (
          <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-900">No resumes saved yet</p>
            <p className="mt-3 text-sm text-slate-600">Save a resume from the builder and it will appear here automatically.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {resumes.map((resume) => (
              <div key={resume.id} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Resume</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-950">{resume.title}</h2>
                    <p className="mt-1 text-sm text-slate-600">Saved {formatDate(resume.savedAt)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => openResume(resume)}
                      className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </button>
                    <button
                      onClick={() => openResume(resume)}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteResume(resume.id)}
                      className="inline-flex items-center rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
