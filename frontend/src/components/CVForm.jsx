import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Plus, X } from 'lucide-react'
import AIButton from './AIButton'
import { improveSkills, improveText, generateSummary, rewriteText, rewriteExperience, createResume, updateResume, getResume } from '../services/api'
import LanguagesSection from './LanguagesSection'
import AchievementsSection from './AchievementsSection'
import ReferencesSection from './ReferencesSection'
import SummarySection from './SummarySection'
import EducationSection from './EducationSection'
import ExperienceSection from './ExperienceSection'
import SkillsSection from './SkillsSection'
import TemplateCard from './TemplateCard'

const initialEducation = [{ degree: '', university: '', years: '' }]
const initialExperience = [{ company: '', role: '', duration: '', responsibilities: '' }]
const templates = [
  { id: 'modern', name: 'Modern', accent: 'bg-gradient-to-br from-slate-900 via-violet-700 to-slate-900' },
  { id: 'ats', name: 'ATS', accent: 'bg-slate-200' },
  { id: 'professional', name: 'Professional', accent: 'bg-gradient-to-br from-blue-600 to-slate-900' },
  { id: 'executive', name: 'Executive', accent: 'bg-slate-800' },
  { id: 'creative', name: 'Creative', accent: 'bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-300' },
]

export default function CVForm({ onDataChange }) {
  const [personal, setPersonal] = useState({
    name: 'Avery Carter',
    email: 'avery@careers.com',
    phone: '+1 555 111 2222',
    location: 'Austin, TX',
    linkedin: 'linkedin.com/in/averycarter',
    portfolio: 'www.averycarter.dev',
  })
  const [summary, setSummary] = useState(
    'Product-minded engineer with experience building modern SaaS products and leading cross-functional teams.'
  )
  const [education, setEducation] = useState(initialEducation)
  const [experience, setExperience] = useState(initialExperience)
  const [skills, setSkills] = useState(['React', 'Tailwind', 'Product Strategy'])
  const [skillInput, setSkillInput] = useState('')
  const [languages, setLanguages] = useState([])
  const [achievements, setAchievements] = useState([])
  const [referencesMode, setReferencesMode] = useState('request')
  const [references, setReferences] = useState([])
  const [projects, setProjects] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(
    localStorage.getItem('aiResumeBuilderSelectedTemplate') || 'modern'
  )
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [loadingRewriteSummary, setLoadingRewriteSummary] = useState(false)
  const [loadingExperience, setLoadingExperience] = useState(false)
  const [aiError, setAiError] = useState('')
  const [toast, setToast] = useState(null)

  const emitData = (next = {}) => {
    onDataChange?.({
      personal,
      summary,
      education,
      experience,
      skills,
      languages,
      achievements,
      references: referencesMode === 'manual' ? references : [],
      projects,
      selectedTemplate,
      ...next,
    })
  }

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId)
    localStorage.setItem('aiResumeBuilderSelectedTemplate', templateId)
    emitData({ selectedTemplate: templateId })
  }

  const addEducation = () => {
    const next = [...education, { degree: '', university: '', years: '' }]
    setEducation(next)
    emitData({ education: next })
  }

  const addExperience = () => {
    const next = [...experience, { company: '', role: '', duration: '', responsibilities: '' }]
    setExperience(next)
    emitData({ experience: next })
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    window.setTimeout(() => setToast(null), 3200)
  }

  const parseAiResult = (data) => {
    if (!data) {
      throw new Error('No response returned from the AI service.')
    }
    if (data.success === false) {
      throw new Error(data.message || 'AI service returned an error.')
    }
    return data.summary || data.improved_text || data.result || ''
  }

  const extractAiError = (err) => {
    const backendError = err?.response?.data || err?.message || 'Unknown error'
    if (backendError && typeof backendError === 'object') {
      return backendError.message || JSON.stringify(backendError)
    }
    return String(backendError)
  }

  const handleSkillInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addSkill()
    }
  }

  const addSkill = () => {
    const value = skillInput.trim()
    if (!value) return
    if (skills.includes(value)) {
      showToast('Skill already added.', 'error')
      return
    }
    const next = [...skills, value]
    setSkills(next)
    setSkillInput('')
    emitData({ skills: next })
  }

  const removeSkill = (skill) => {
    const next = skills.filter((item) => item !== skill)
    setSkills(next)
    emitData({ skills: next })
  }

  const handlePersonalChange = (field, value) => {
    const next = { ...personal, [field]: value }
    setPersonal(next)
    emitData({ personal: next })
  }

  const handleSummaryChange = (value) => {
    setSummary(value)
    emitData({ summary: value })
  }

  const RESUME_LIST_KEY = 'aiResumeBuilderResumeList'
  const RESUME_CURRENT_KEY = 'aiResumeBuilderResume'
  const RESUME_CURRENT_ID_KEY = 'aiResumeBuilderResumeId'
  const SELECTED_TEMPLATE_KEY = 'aiResumeBuilderSelectedTemplate'

  const getSavedResumes = () => {
    try {
      const saved = localStorage.getItem(RESUME_LIST_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  }

  const saveResumeList = (resumeItem) => {
    const existing = getSavedResumes()
    const next = existing.filter((item) => item.id !== resumeItem.id)
    next.unshift(resumeItem)
    localStorage.setItem(RESUME_LIST_KEY, JSON.stringify(next))
  }

  const createResumeId = () => {
    if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
      return window.crypto.randomUUID()
    }
    return `resume-${Date.now()}`
  }

  const buildResumeTitle = (payload) => {
    const name = payload.personal?.name || 'Untitled Resume'
    return `${name}`
  }

  const handleSaveResume = () => {
    const savedAt = new Date().toISOString()
    const existingId = localStorage.getItem(RESUME_CURRENT_ID_KEY) || createResumeId()
    const payload = {
      personal,
      summary,
      education,
      experience,
      skills,
      languages,
      achievements,
      references: referencesMode === 'manual' ? references : [],
      projects,
      selected_template: selectedTemplate,
      selectedTemplate,
      savedAt,
    }

    localStorage.setItem(RESUME_CURRENT_KEY, JSON.stringify(payload))
    localStorage.setItem(RESUME_CURRENT_ID_KEY, existingId)
    if (selectedTemplate) {
      localStorage.setItem(SELECTED_TEMPLATE_KEY, selectedTemplate)
    }

    saveResumeList({
      id: existingId,
      title: buildResumeTitle(payload),
      savedAt,
      data: payload,
    })

    emitData()

    ;(async () => {
      try {
        if (existingId) {
          const res = await updateResume(existingId, {
            personal_information: personal,
            summary,
            education,
            experience,
            skills,
            selected_template: selectedTemplate,
            languages,
            achievements,
            references: referencesMode === 'manual' ? references : [],
            projects,
          })
          if (res?.data?.resume?.id) {
            localStorage.setItem(RESUME_CURRENT_ID_KEY, res.data.resume.id)
            saveResumeList({
              id: res.data.resume.id,
              title: buildResumeTitle(payload),
              savedAt,
              data: payload,
            })
          }
        }
      } catch (err) {
        console.debug('Backend save skipped or failed', err?.message || err)
      }
    })()

    alert('Resume saved locally and attempted backend save.')
  }

  const handleGenerateSummary = async () => {
    setAiError('')
    setLoadingSummary(true)
    console.log('[AI] Generate Summary request', { endpoint: '/api/ai/summary', text: summary })
    try {
      const { data } = await generateSummary({ text: summary })
      console.log('[AI] Generate Summary response', data)
      const generatedText = parseAiResult(data)
      if (!generatedText) {
        throw new Error('The AI service returned an empty summary.')
      }
      setSummary(generatedText)
      emitData({ summary: generatedText })
      showToast('Summary generated successfully.')
    } catch (err) {
      const errorMessage = extractAiError(err)
      console.error('[AI] Generate Summary error', errorMessage)
      setAiError(`Unable to generate your summary: ${errorMessage}`)
      showToast('Summary generation failed.', 'error')
    } finally {
      setLoadingSummary(false)
    }
  }

  const handleRewriteSummary = async () => {
    if (!summary.trim()) {
      setAiError('Please enter a summary before rewriting.')
      return
    }
    setAiError('')
    setLoadingRewriteSummary(true)
    console.log('[AI] Rewrite Summary request', { endpoint: '/api/ai/rewrite', text: summary, purpose: 'rewrite_summary' })
    try {
      const { data } = await rewriteText({ text: summary, purpose: 'rewrite_summary' })
      console.log('[AI] Rewrite Summary response', data)
      const rewritten = parseAiResult(data)
      if (!rewritten) {
        throw new Error('No rewritten text returned from backend')
      }
      setSummary(rewritten)
      emitData({ summary: rewritten })
      showToast('Summary rewritten successfully.')
    } catch (err) {
      const errorMessage = extractAiError(err)
      console.error('[AI] Rewrite Summary error', errorMessage)
      setAiError(`Unable to rewrite your summary: ${errorMessage}`)
      showToast('Summary rewrite failed.', 'error')
    } finally {
      setLoadingRewriteSummary(false)
    }
  }

  const handleRewriteExperience = async () => {
    setAiError('')
    setLoadingExperience(true)
    const experienceText = experience
      .map((item) => `${item.role || '[Role]'} at ${item.company || '[Company]'}: ${item.responsibilities || ''}`)
      .join('\n')
    console.log('[AI] Rewrite Experience request', { endpoint: '/api/ai/experience-rewrite', text: experienceText })
    try {
      const { data } = await rewriteExperience({ text: experienceText })
      console.log('[AI] Rewrite Experience response', data)
      const rewritten = parseAiResult(data)
      if (!rewritten) {
        throw new Error('No rewritten text returned from backend')
      }
      const next = experience.map((item) => ({ ...item, responsibilities: rewritten }))
      setExperience(next)
      emitData({ experience: next })
      showToast('Experience rewritten successfully.')
    } catch (err) {
      const errorMessage = extractAiError(err)
      console.error('[AI] Rewrite Experience error', errorMessage)
      setAiError(`Unable to rewrite your experience section: ${errorMessage}`)
      showToast('Experience rewrite failed.', 'error')
    } finally {
      setLoadingExperience(false)
    }
  }

  const moveExperience = (index, direction) => {
    const next = [...experience]
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= next.length) return
    const updated = [...next]
    const temp = updated[targetIndex]
    updated[targetIndex] = updated[index]
    updated[index] = temp
    setExperience(updated)
    emitData({ experience: updated })
  }

  const removeExperience = (index) => {
    const next = experience.filter((_, idx) => idx !== index)
    setExperience(next)
    emitData({ experience: next })
  }

  const addProject = () => {
    const next = [...projects, { name: '', technologies: '', duration: '', description: '' }]
    setProjects(next)
    emitData({ projects: next })
  }

  const updateProject = (index, field, value) => {
    const next = projects.map((project, idx) => (idx === index ? { ...project, [field]: value } : project))
    setProjects(next)
    emitData({ projects: next })
  }

  const removeProject = (index) => {
    const next = projects.filter((_, idx) => idx !== index)
    setProjects(next)
    emitData({ projects: next })
  }

  const handleRewriteSingleExperience = async (index) => {
    setAiError('')
    setLoadingExperience(true)
    const item = experience[index]
    if (!item) {
      setLoadingExperience(false)
      return
    }
    try {
      const payloadText = item.responsibilities || item.description || ''
      const { data } = await rewriteExperience({ text: payloadText })
      const improved = parseAiResult(data)
      if (!improved) {
        throw new Error('No rewritten text returned from backend')
      }
      const updated = experience.map((exp, idx) => (idx === index ? { ...exp, responsibilities: improved } : exp))
      setExperience(updated)
      emitData({ experience: updated })
      showToast('Experience rewritten successfully.')
    } catch (err) {
      const errorMessage = extractAiError(err)
      console.error('[AI] Rewrite Single Experience error', errorMessage)
      setAiError(`Unable to rewrite this experience. ${errorMessage}`)
      showToast('Experience rewrite failed.', 'error')
    } finally {
      setLoadingExperience(false)
    }
  }

  const [loadingSkills, setLoadingSkills] = useState(false)

  const handleImproveSkills = async () => {
    setAiError('')
    setLoadingSkills(true)
    console.log('[AI] Improve Skills request', { endpoint: '/api/ai/improve-skills', skills })
    try {
      const skillsText = skills.join(', ')
      const { data } = await improveSkills({ text: skillsText })
      console.log('[AI] Improve Skills response', data)
      const improved = data?.improved_text || data?.result || ''
      const parsed = improved.split(',').map((s) => s.trim()).filter(Boolean)
      if (parsed.length) {
        setSkills(parsed)
        emitData({ skills: parsed })
        showToast('Skills improved successfully.')
      } else {
        throw new Error('No skills returned from AI service')
      }
    } catch (err) {
      const errorMessage = extractAiError(err)
      console.error('[AI] Improve Skills error', errorMessage)
      setAiError(`Unable to improve skills: ${errorMessage}`)
      showToast('Improve skills failed.', 'error')
    } finally {
      setLoadingSkills(false)
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('aiResumeBuilderResume')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object') {
          if (parsed.personal) setPersonal(parsed.personal)
          if (typeof parsed.summary === 'string') setSummary(parsed.summary)
          if (Array.isArray(parsed.education)) setEducation(parsed.education)
          if (Array.isArray(parsed.experience)) setExperience(parsed.experience)
          if (Array.isArray(parsed.skills)) setSkills(parsed.skills)
          if (Array.isArray(parsed.languages)) setLanguages(parsed.languages)
          if (Array.isArray(parsed.projects)) setProjects(parsed.projects)
          if (Array.isArray(parsed.achievements)) setAchievements(parsed.achievements)
          if (Array.isArray(parsed.references)) {
            setReferences(parsed.references)
            setReferencesMode(parsed.references.length > 0 ? 'manual' : 'request')
          }
          if (parsed.selected_template || parsed.selectedTemplate) {
            const template = parsed.selected_template || parsed.selectedTemplate
            setSelectedTemplate(template)
            localStorage.setItem('aiResumeBuilderSelectedTemplate', template)
          }
          emitData({
            personal: parsed.personal || personal,
            summary: parsed.summary || summary,
            education: parsed.education || education,
            experience: parsed.experience || experience,
            skills: parsed.skills || skills,
            languages: parsed.languages || languages,
            projects: parsed.projects || projects,
            achievements: parsed.achievements || achievements,
            references: parsed.references || (referencesMode === 'manual' ? references : []),
            selectedTemplate: parsed.selected_template || parsed.selectedTemplate || selectedTemplate,
          })
          return
        }
      } catch {
        // ignore invalid saved state
      }
    }

    const tryLoadFromServer = async () => {
      const resumeId = localStorage.getItem('aiResumeBuilderResumeId')
      if (!resumeId) {
        emitData()
        return
      }
      try {
        const res = await getResume(resumeId)
        if (res?.data) {
          const r = res.data
          if (r.personal_information) setPersonal(r.personal_information)
          if (typeof r.summary === 'string') setSummary(r.summary)
          if (Array.isArray(r.education)) setEducation(r.education)
          if (Array.isArray(r.experience)) setExperience(r.experience)
          if (Array.isArray(r.skills)) setSkills(r.skills)
          if (Array.isArray(r.languages)) setLanguages(r.languages)
          if (Array.isArray(r.projects)) setProjects(r.projects)
          if (Array.isArray(r.achievements)) setAchievements(r.achievements)
          if (Array.isArray(r.references)) {
            setReferences(r.references)
            setReferencesMode(r.references.length > 0 ? 'manual' : 'request')
          }
          if (r.selected_template) {
            setSelectedTemplate(r.selected_template)
            localStorage.setItem('aiResumeBuilderSelectedTemplate', r.selected_template)
          }
          emitData({
            personal: r.personal_information || personal,
            summary: r.summary || summary,
            education: r.education || education,
            experience: r.experience || experience,
            skills: Array.isArray(r.skills) ? r.skills : skills,
            languages: Array.isArray(r.languages) ? r.languages : languages,
            projects: Array.isArray(r.projects) ? r.projects : projects,
            achievements: Array.isArray(r.achievements) ? r.achievements : achievements,
            references: Array.isArray(r.references) ? r.references : (referencesMode === 'manual' ? references : []),
            selectedTemplate: r.selected_template || selectedTemplate,
          })
          return
        }
      } catch (err) {
        console.debug('Could not load resume from backend', err?.message || err)
      }
      emitData()
    }

    tryLoadFromServer()
  }, [])

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Professional Details</h2>
          <p className="text-sm text-slate-600">Build a polished profile for recruiters and ATS systems.</p>
        </div>
        <div className="flex gap-2">
          <AIButton label="Save Resume" onClick={handleSaveResume} />
          <AIButton label="Generate Summary" onClick={handleGenerateSummary} loading={loadingSummary} />
        </div>
      </div>
      {toast ? (
        <div className={`rounded-3xl border px-4 py-3 text-sm ${toast.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {toast.message}
        </div>
      ) : null}

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Templates</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 auto-rows-fr">
          {templates.map((t) => (
            <TemplateCard key={t.id} id={t.id} name={t.name} accent={t.accent} selected={selectedTemplate === t.id} onSelect={handleTemplateChange} />
          ))}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <SummarySection>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Professional Summary</h3>
                <p className="mt-1 text-sm text-slate-500">Keep this summary concise, recruiter-friendly, and achievement-oriented.</p>
              </div>
              <AIButton label="AI Rewrite" onClick={handleRewriteSummary} loading={loadingRewriteSummary} />
            </div>
            <textarea rows="4" value={summary} onChange={(e) => handleSummaryChange(e.target.value)} className="w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-500" />
          </SummarySection>

          <EducationSection>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Education</h3>
              <AIButton label="Add Education" onClick={addEducation} />
            </div>
            <div className="space-y-4">
              {education.map((item, index) => (
                <div key={index} className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-3">
                  <input value={item.degree} onChange={(e) => { const next = education.map((edu, idx) => (idx === index ? { ...edu, degree: e.target.value } : edu)); setEducation(next); emitData({ education: next }) }} placeholder="Degree" className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none" />
                  <input value={item.university} onChange={(e) => { const next = education.map((edu, idx) => (idx === index ? { ...edu, university: e.target.value } : edu)); setEducation(next); emitData({ education: next }) }} placeholder="University" className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none" />
                  <input value={item.years} onChange={(e) => { const next = education.map((edu, idx) => (idx === index ? { ...edu, years: e.target.value } : edu)); setEducation(next); emitData({ education: next }) }} placeholder="Years" className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none" />
                </div>
              ))}
            </div>
          </EducationSection>

          <ExperienceSection>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Experience</h3>
                <p className="mt-1 text-sm text-slate-500">Use concise bullets that quantify results and impacts.</p>
              </div>
              <AIButton label="Rewrite Experience" onClick={handleRewriteExperience} loading={loadingExperience} />
            </div>
            <div className="space-y-4">
              {experience.map((item, index) => (
                <div key={index} className="box-border w-full max-w-full overflow-hidden space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <AIButton label="Rewrite" onClick={() => handleRewriteSingleExperience(index)} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button type="button" onClick={() => moveExperience(index, -1)} className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-violet-500 hover:text-violet-700">
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => moveExperience(index, 1)} className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-violet-500 hover:text-violet-700">
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => removeExperience(index)} className="inline-flex h-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100">
                        Delete
                      </button>
                    </div>
                  </div>
                  <input value={item.company} onChange={(e) => { const next = experience.map((exp, idx) => (idx === index ? { ...exp, company: e.target.value } : exp)); setExperience(next); emitData({ experience: next }) }} placeholder="Company Name" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none" />
                  <input value={item.role} onChange={(e) => { const next = experience.map((exp, idx) => (idx === index ? { ...exp, role: e.target.value } : exp)); setExperience(next); emitData({ experience: next }) }} placeholder="Job Role" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none" />
                  <input value={item.duration} onChange={(e) => { const next = experience.map((exp, idx) => (idx === index ? { ...exp, duration: e.target.value } : exp)); setExperience(next); emitData({ experience: next }) }} placeholder="Duration" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none" />
                  <textarea rows="3" value={item.responsibilities} onChange={(e) => { const next = experience.map((exp, idx) => (idx === index ? { ...exp, responsibilities: e.target.value } : exp)); setExperience(next); emitData({ experience: next }) }} placeholder="Responsibilities" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none" />
                </div>
              ))}
            </div>
            <AIButton label="Add Experience" onClick={addExperience} />
          </ExperienceSection>

          <SkillsSection>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Skills</h3>
                <p className="mt-1 text-sm text-slate-500">Use strong keywords relevant to your target role.</p>
              </div>
              <AIButton label="Improve Skills" onClick={handleImproveSkills} loading={loadingSkills} />
            </div>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                >
                  <span>{skill}</span>
                  <X className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillInputKeyDown}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none"
                placeholder="Add skill"
              />
              <button type="button" onClick={addSkill} className="inline-flex h-12 items-center justify-center rounded-full bg-violet-600 px-5 text-sm font-semibold text-white transition duration-200 hover:bg-violet-700">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-slate-600">
              {['Leadership', 'AI', 'Design Systems', 'Analytics'].map((item) => (
                <button key={item} onClick={() => setSkillInput(item)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-violet-500 hover:text-violet-700">
                  {item}
                </button>
              ))}
            </div>
          </SkillsSection>
        </div>

        <div className="space-y-6">
          <AchievementsSection achievements={achievements} setAchievements={(next) => { setAchievements(next); emitData({ achievements: next }) }} />
          <ReferencesSection referencesMode={referencesMode} setReferencesMode={(m) => { setReferencesMode(m); if (m === 'request') { setReferences([]); emitData({ references: [] }) } }} references={references} setReferences={(next) => { setReferences(next); emitData({ references: next }) }} />
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Projects</h3>
                <p className="mt-1 text-sm text-slate-500">Add your portfolio projects to strengthen your resume.</p>
              </div>
              <AIButton label="Add Project" onClick={addProject} />
            </div>
            <div className="space-y-4 mt-4">
              {projects.map((project, index) => (
                <div key={index} className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">Project {index + 1}</p>
                    <button type="button" onClick={() => removeProject(index)} className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100">Remove</button>
                  </div>
                  <input
                    value={project.name}
                    onChange={(e) => updateProject(index, 'name', e.target.value)}
                    placeholder="Project Title"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                  />
                  <input
                    value={project.technologies}
                    onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                    placeholder="Technologies Used"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                  />
                  <input
                    value={project.duration}
                    onChange={(e) => updateProject(index, 'duration', e.target.value)}
                    placeholder="Duration"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                  />
                  <textarea
                    rows="3"
                    value={project.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    placeholder="Description"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                  />
                </div>
              ))}
              {projects.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">Add project entries to show them in the preview and export.</div>
              ) : null}
            </div>
          </section>

          <LanguagesSection languages={languages} setLanguages={(next) => { setLanguages(next); emitData({ languages: next }) }} />
        </div>
      </div>
    </div>
  )
}
