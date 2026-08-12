import { useRef } from 'react'
import { Download, FileText, Sparkles } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Document as DocxDocument, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'

const templateStyles = {
  modern: {
    header: 'bg-gradient-to-r from-slate-900 via-violet-900 to-slate-900 text-white',
    section: 'bg-white',
    title: 'text-slate-500',
    body: 'xl:grid-cols-[280px_minmax(0,1fr)]',
    sidebar: 'space-y-6',
    contentCard: 'rounded-3xl border border-slate-200 bg-slate-50 p-6',
  },
  ats: {
    header: 'bg-slate-900 text-white',
    section: 'bg-slate-50',
    title: 'text-slate-600',
    body: 'grid-cols-1',
    sidebar: '',
    contentCard: 'rounded-3xl border border-slate-200 bg-white p-6',
  },
  creative: {
    header: 'bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 text-slate-950',
    section: 'bg-white',
    title: 'text-slate-600',
    body: 'lg:grid-cols-[240px_minmax(0,1fr)]',
    sidebar: 'space-y-6',
    contentCard: 'rounded-3xl border border-slate-200 bg-slate-50 p-6',
  },
  professional: {
    header: 'bg-gradient-to-r from-blue-600 via-slate-900 to-slate-800 text-white',
    section: 'bg-white',
    title: 'text-slate-600',
    body: 'lg:grid-cols-[1fr_1fr]',
    sidebar: '',
    contentCard: 'rounded-3xl border border-slate-200 bg-slate-50 p-6',
  },
  executive: {
    header: 'bg-slate-950 text-white',
    section: 'bg-white',
    title: 'text-slate-700',
    body: 'max-w-4xl mx-auto',
    sidebar: '',
    contentCard: 'rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)]',
  },
  minimal: {
    header: 'bg-slate-100 text-slate-900',
    section: 'bg-white',
    title: 'text-slate-700',
    body: 'grid-cols-1',
    sidebar: '',
    contentCard: 'rounded-3xl border border-slate-200 bg-white p-6',
  },
}

export default function CVPreview({ data }) {
  const previewRef = useRef(null)
  const {
    personal = {},
    summary = '',
    skills = [],
    education = [],
    experience = [],
    projects = [],
    references = [],
    achievements = [],
    selectedTemplate = 'modern',
  } = data || {}

  const template = templateStyles[selectedTemplate] || templateStyles.modern

  const downloadFile = (filename, content, mimeType) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const skillsText = (skills || []).join(', ')

  const buildResumeText = () => {
    const headerLines = [
      personal?.name,
      personal?.email,
      personal?.phone,
      personal?.location,
    ].filter(Boolean)

    const educationLines = (education || []).flatMap((item) => {
      const fields = [
        item.degree,
        item.university,
        item.startYear || item.years,
        item.endYear,
        item.gpa,
      ].filter(Boolean)
      return fields.length ? [`- ${fields.join(' | ')}`] : []
    })

    const experienceLines = (experience || []).flatMap((item) => {
      const header = [item.role, item.company, item.duration].filter(Boolean).join(' | ')
      return header ? [`- ${header}`, item.description || item.responsibilities || ''] : []
    })

    const referenceLines = (references || []).flatMap((item) => {
      const line = [item.name, item.position, item.company, item.email, item.phone].filter(Boolean).join(' | ')
      return line ? [`- ${line}`] : []
    })

    const projectLines = (projects || []).flatMap((item) => {
      const header = [item.name || item.title || item.projectName, item.duration, item.technologies]
        .filter(Boolean)
        .join(' | ')
      return header ? [`- ${header}`, item.description || ''] : []
    })

    const languageLines = (data?.languages || []).flatMap((item) => {
      const line = `${item.name}${item.proficiency ? ` — ${item.proficiency}` : ''}`
      return line ? [`- ${line}`] : []
    })

    return [
      headerLines.join(' | '),
      '',
      'Professional Summary',
      summary || 'Add your professional summary here.',
      '',
      educationLines.length ? 'Education' : null,
      educationLines.length ? educationLines.join('\n') : null,
      experienceLines.length ? 'Experience' : null,
      experienceLines.length ? experienceLines.join('\n') : null,
      skillsText ? 'Skills' : null,
      skillsText || null,
      referenceLines.length ? 'References' : null,
      referenceLines.length ? referenceLines.join('\n') : null,
      projectLines.length ? 'Projects' : null,
      projectLines.length ? projectLines.join('\n') : null,
      languageLines.length ? 'Languages' : null,
      languageLines.length ? languageLines.join('\n') : null,
    ]
      .filter(Boolean)
      .join('\n')
  }

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return

    const mmToPx = (mm) => mm * (96 / 25.4)
    const pageMarginMm = 10
    const pdfWidthMm = 210
    const pdfHeightMm = 297
    const contentWidthMm = pdfWidthMm - pageMarginMm * 2
    const contentHeightMm = pdfHeightMm - pageMarginMm * 2
    const contentWidthPx = Math.round(mmToPx(contentWidthMm))

    const hiddenContainer = document.createElement('div')
    hiddenContainer.style.position = 'fixed'
    hiddenContainer.style.left = '-9999px'
    hiddenContainer.style.top = '0'
    hiddenContainer.style.width = `${contentWidthPx}px`
    hiddenContainer.style.minHeight = '100vh'
    hiddenContainer.style.padding = '0'
    hiddenContainer.style.margin = '0'
    hiddenContainer.style.opacity = '0'
    hiddenContainer.style.pointerEvents = 'none'
    hiddenContainer.style.zIndex = '-1'

    const clone = previewRef.current.cloneNode(true)
    clone.style.width = `${contentWidthPx}px`
    clone.style.maxWidth = '100%'
    clone.style.boxSizing = 'border-box'
    clone.style.margin = '0'
    clone.style.padding = '0'
    clone.style.transform = 'none'
    clone.style.transformOrigin = 'top left'
    clone.style.background = '#ffffff'
    clone.style.overflow = 'visible'
    clone.classList.add('pdf-export')

    const style = document.createElement('style')
    style.textContent = `
      @page { size: A4 portrait; margin: 0; }
      .pdf-export, .pdf-export * { box-sizing: border-box !important; transform: none !important; }
      .pdf-export { background: #ffffff !important; color: #111827 !important; width: 100% !important; font-size: 11px !important; line-height: 1.35 !important; margin: 0 !important; padding: 0 !important; }
      .pdf-export h1, .pdf-export h2 { font-size: 15px !important; margin-top: 8px !important; margin-bottom: 6px !important; }
      .pdf-export h3 { font-size: 14px !important; margin-top: 8px !important; margin-bottom: 4px !important; }
      .pdf-export p, .pdf-export span, .pdf-export div, .pdf-export li { font-size: 11px !important; line-height: 1.35 !important; }
      .pdf-export .text-sm { font-size: 11px !important; }
      .pdf-export .space-y-6 > * + *, .pdf-export .space-y-5 > * + *, .pdf-export .space-y-4 > * + * { margin-top: 10px !important; }
      .pdf-export .space-y-2 > * + * { margin-top: 6px !important; }
      .pdf-export .p-6, .pdf-export .p-5, .pdf-export .p-4, .pdf-export .px-6, .pdf-export .px-5, .pdf-export .px-4, .pdf-export .py-6, .pdf-export .py-5, .pdf-export .py-4 { padding: 10px !important; }
      .pdf-export .rounded-3xl { border-radius: 14px !important; }
      .pdf-export .rounded-2xl { border-radius: 10px !important; }
      .pdf-export .border { border-width: 1px !important; }
      .pdf-export .shadow-sm { box-shadow: none !important; }
      .pdf-export .flex.flex-wrap.gap-2 > * { margin: 2px 0 !important; }
      .pdf-export .grid.gap-6, .pdf-export .grid.gap-4, .pdf-export .grid.gap-3, .pdf-export .flex.gap-3, .pdf-export .flex.gap-2 { gap: 6px !important; }
      .pdf-export .mt-2, .pdf-export .mt-3, .pdf-export .mt-4, .pdf-export .mt-5, .pdf-export .mt-6 { margin-top: 8px !important; }
      .pdf-export .mb-3, .pdf-export .mb-4, .pdf-export .mb-5, .pdf-export .mb-6 { margin-bottom: 8px !important; }
      .pdf-export { page-break-inside: avoid !important; break-inside: avoid !important; }
      .pdf-export section, .pdf-export article, .pdf-export div { page-break-inside: avoid !important; break-inside: avoid !important; }
    `
    hiddenContainer.appendChild(style)
    hiddenContainer.appendChild(clone)
    document.body.appendChild(hiddenContainer)

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true })
    const margin = pageMarginMm
    const maxContentHeight = contentHeightMm

    const canvas = await html2canvas(clone, {
      scale: Math.min(window.devicePixelRatio || 1, 2),
      useCORS: true,
      backgroundColor: '#ffffff',
      scrollY: 0,
      width: clone.offsetWidth,
      height: clone.offsetHeight,
    })

    const imgWidthMm = contentWidthMm
    const imgHeightMm = (canvas.height * contentWidthMm) / canvas.width
    const pageHeightPx = Math.floor((canvas.height * maxContentHeight) / imgHeightMm)
    let sliceY = 0
    let pageIndex = 0

    while (sliceY < canvas.height) {
      const sliceHeight = Math.min(pageHeightPx, canvas.height - sliceY)
      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = canvas.width
      pageCanvas.height = sliceHeight
      const pageCtx = pageCanvas.getContext('2d')
      pageCtx.drawImage(canvas, 0, sliceY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight)

      const pageImgData = pageCanvas.toDataURL('image/png')
      const pageImgHeightMm = (sliceHeight * imgWidthMm) / canvas.width
      pdf.addImage(pageImgData, 'PNG', margin, margin, imgWidthMm, pageImgHeightMm)

      sliceY += sliceHeight
      pageIndex += 1
      if (sliceY < canvas.height) pdf.addPage()
    }

    pdf.save('resume.pdf')
    document.body.removeChild(hiddenContainer)
  }

  const handleDownloadDOCX = () => {
    try {
      const doc = new DocxDocument()
      const children = []
      // Header
      children.push(new Paragraph({ text: personal?.name || 'Your Name', heading: HeadingLevel.HEADING_1 }))
      const contact = [personal?.email, personal?.phone, personal?.location].filter(Boolean).join(' • ')
      if (contact) children.push(new Paragraph({ children: [new TextRun(contact)] }))

      // Summary
      children.push(new Paragraph({ text: 'Professional Summary', heading: HeadingLevel.HEADING_2 }))
      children.push(new Paragraph({ children: [new TextRun(summary || 'Your summary will appear here.')] }))

      // Education
      children.push(new Paragraph({ text: 'Education', heading: HeadingLevel.HEADING_2 }))
      if (Array.isArray(education) && education.length > 0) {
        education.forEach((item) => {
          const degree = `${item.degree || ''} ${item.university ? '— ' + item.university : ''}`
          children.push(new Paragraph({ children: [new TextRun(degree)] }))
        })
      } else {
        children.push(new Paragraph({ children: [new TextRun('No education entries yet.')] }))
      }

      // Experience
      children.push(new Paragraph({ text: 'Experience', heading: HeadingLevel.HEADING_2 }))
      if (Array.isArray(experience) && experience.length > 0) {
        experience.forEach((item) => {
          const header = `${item.role || ''} — ${item.company || ''} ${item.duration ? '(' + item.duration + ')' : ''}`
          children.push(new Paragraph({ children: [new TextRun({ text: header, bold: true })] }))
          if (item.responsibilities) children.push(new Paragraph({ children: [new TextRun(item.responsibilities)] }))
        })
      } else {
        children.push(new Paragraph({ children: [new TextRun('No experience entries yet.')] }))
      }

      // Skills
      children.push(new Paragraph({ text: 'Skills', heading: HeadingLevel.HEADING_2 }))
      children.push(new Paragraph({ children: [new TextRun((skills || []).join(', ') || 'No skills added.')] }))

      if (Array.isArray(data?.references) && data.references.length > 0) {
        children.push(new Paragraph({ text: 'References', heading: HeadingLevel.HEADING_2 }))
        data.references.forEach((r) => children.push(new Paragraph({ children: [new TextRun(`${r.name || ''}${r.position ? ' — ' + r.position : ''}${r.company ? ' • ' + r.company : ''}${r.email ? ' • ' + r.email : ''}${r.phone ? ' • ' + r.phone : ''}`)] })))
      }

      if (Array.isArray(projects) && projects.length > 0) {
        children.push(new Paragraph({ text: 'Projects', heading: HeadingLevel.HEADING_2 }))
        projects.forEach((p) => {
          const header = [p.name || p.title || '', p.duration, p.technologies].filter(Boolean).join(' | ')
          if (header) children.push(new Paragraph({ children: [new TextRun(header)] }))
          if (p.description) children.push(new Paragraph({ children: [new TextRun(p.description)] }))
        })
      }

      if (Array.isArray(data?.languages) && data.languages.length > 0) {
        children.push(new Paragraph({ text: 'Languages', heading: HeadingLevel.HEADING_2 }))
        data.languages.forEach((l) => {
          const line = typeof l === 'string' ? l : `${l.name}${l.proficiency ? ' — ' + l.proficiency : ''}`
          if (line) children.push(new Paragraph({ children: [new TextRun(line)] }))
        })
      }

      if (Array.isArray(data?.achievements) && data.achievements.length > 0) {
        children.push(new Paragraph({ text: 'Achievements', heading: HeadingLevel.HEADING_2 }))
        data.achievements.forEach((a) => children.push(new Paragraph({ children: [new TextRun(a.title || a || '')] })))
      }

      doc.addSection({ children })
      Packer.toBlob(doc).then((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'resume.docx'
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
      })
    } catch (err) {
      console.error('DOCX export failed', err)
      // fallback to plain-text docx
      downloadFile('resume.docx', buildResumeText(), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    }
  }

  const handleDownloadHTML = () => {
    const sectionHtml = (title, content) =>
      `<h2>${title}</h2>${content}`

    const educationHtml = (education || [])
      .map((item) => {
        const yearRange = [item.startYear || item.years, item.endYear].filter(Boolean).join(' - ')
        const gpa = item.gpa ? ` • GPA: ${item.gpa}` : ''
        return `<div class="mb-3"><h3>${item.degree || ''}</h3><p>${item.university || ''}${yearRange ? ` • ${yearRange}` : ''}${gpa}</p></div>`
      })
      .join('')

    const experienceHtml = (experience || [])
      .map((item) => {
        return `<div class="mb-3"><h3>${item.role || ''}</h3><p>${item.company || ''}${item.duration ? ` • ${item.duration}` : ''}</p><p>${item.description || item.responsibilities || ''}</p></div>`
      })
      .join('')

    const skillsHtml = (skills || []).map((skill) => `<span style="display:inline-block;margin:2px 4px;padding:4px 10px;background:#f1f5f9;border-radius:999px;font-size:0.85rem;">${skill}</span>`).join(' ')

    const projectsHtml = (projects || [])
      .map((item) => {
        const header = [item.name || item.title || item.projectName || '', item.duration, item.technologies].filter(Boolean).join(' • ')
        return `<div class="mb-3"><h3>${header}</h3><p>${item.description || ''}</p></div>`
      })
      .join('')

    const languagesHtml = (data?.languages || []).map((l) => `<div>${typeof l === 'string' ? l : `${l.name} — ${l.proficiency}`}</div>`).join('')
    const achievementsHtml = (data?.achievements || []).map((a) => `<div><strong>${a.title || ''}</strong><p>${a.description || ''}</p></div>`).join('')
    const referencesHtml = (data?.references || []).map((r) => `<div><strong>${r.name || ''}</strong><p>${r.position || ''}${r.company ? ' • ' + r.company : ''}${r.email ? ' • ' + r.email : ''}${r.phone ? ' • ' + r.phone : ''}</p></div>`).join('')

    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Resume</title><style>body{font-family:system-ui, sans-serif;color:#1f2937;padding:24px;}h1{font-size:28px;margin-bottom:8px;}h2{font-size:18px;margin-top:24px;margin-bottom:8px;}h3{font-size:16px;margin-bottom:4px;}p{margin:0 0 10px 0;line-height:1.6;} .section{margin-bottom:18px;}</style></head><body><div class="section"><h1>${personal?.name || 'Your Name'}</h1><p>${personal?.email || ''}${personal?.phone ? ` • ${personal?.phone}` : ''}${personal?.location ? ` • ${personal?.location}` : ''}</p></div><div class="section"><h2>Professional Summary</h2><p>${summary || 'Add your professional summary here.'}</p></div>${educationHtml ? `<div class="section"><h2>Education</h2>${educationHtml}</div>` : ''}${experienceHtml ? `<div class="section"><h2>Experience</h2>${experienceHtml}</div>` : ''}${skillsHtml ? `<div class="section"><h2>Skills</h2><p>${skillsHtml}</p></div>` : ''}${referencesHtml ? `<div class="section"><h2>References</h2>${referencesHtml}</div>` : ''}${projectsHtml ? `<div class="section"><h2>Projects</h2>${projectsHtml}</div>` : ''}${languagesHtml ? `<div class="section"><h2>Languages</h2>${languagesHtml}</div>` : ''}${achievementsHtml ? `<div class="section"><h2>Achievements</h2>${achievementsHtml}</div>` : ''}</body></html>`
    downloadFile('resume.html', html, 'text/html')
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Preview & Export</h3>
            <p className="mt-1 text-sm text-slate-500">Your resume export will match this preview.</p>
          </div>
          <div className="grid gap-3 sm:grid-flow-col sm:auto-cols-max">
            <button type="button" onClick={handleDownloadPDF} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white transition duration-200 hover:bg-violet-700">
              <Download className="h-4 w-4" /> PDF
            </button>
            <button type="button" onClick={handleDownloadDOCX} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition duration-200 hover:border-violet-500 hover:text-violet-700">
              <FileText className="h-4 w-4" /> DOCX
            </button>
            <button type="button" onClick={handleDownloadHTML} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition duration-200 hover:border-violet-500 hover:text-violet-700">
              <Sparkles className="h-4 w-4" /> HTML
            </button>
          </div>
        </div>
      </section>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div ref={previewRef} className="bg-white">
          <div className={`${template.header} p-6`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-3xl font-semibold">{personal?.name || 'Your Name'}</h2>
                <p className="mt-2 text-sm text-white/80">
                  <span className="mr-2">{personal?.email || 'Email'}</span>
                  {personal?.phone ? <span className="mr-2">• {personal?.phone}</span> : null}
                  {personal?.location ? <span>• {personal?.location}</span> : null}
                </p>
              </div>
              {selectedTemplate !== 'ats' && (
                <div className="rounded-2xl bg-white/10 p-3">
                  <Sparkles className="h-5 w-5" />
                </div>
              )}
            </div>
          </div>

          <div className={`grid gap-6 p-6 ${template.body || ''}`}>
            {(selectedTemplate === 'modern' || selectedTemplate === 'creative') && (
              <aside className={`${template.sidebar}`}>
                <div className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${selectedTemplate === 'creative' ? 'bg-gradient-to-b from-pink-500 via-orange-400 to-yellow-300 text-slate-950' : ''}`}>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">Contact</h3>
                  <div className="mt-3 space-y-2 text-sm leading-6">
                    <p>{personal?.email || 'Email'}</p>
                    {personal?.phone ? <p>{personal.phone}</p> : null}
                    {personal?.location ? <p>{personal.location}</p> : null}
                    {personal?.linkedin ? <p>{personal.linkedin}</p> : null}
                    {personal?.portfolio ? <p>{personal.portfolio}</p> : null}
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">Skills</h3>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    {skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-slate-100 px-3 py-2 text-slate-700">{skill}</span>
                    ))}
                  </div>
                </div>
              </aside>
            )}

            <main className="space-y-6">
              <section className={`${template.contentCard}`}>
                <h3 className={`mb-4 text-sm font-semibold uppercase tracking-[0.2em] ${template.title}`}>Professional Summary</h3>
                <p className={`text-sm leading-7 ${selectedTemplate === 'ats' ? 'text-slate-900' : 'text-slate-700'}`}>{summary || 'Your summary will appear here.'}</p>
              </section>

              <section className={`${template.contentCard}`}>
                <h3 className={`mb-4 text-sm font-semibold uppercase tracking-[0.2em] ${template.title}`}>Education</h3>
                <div className="space-y-4">
                  {(Array.isArray(education) && education.length > 0) ? (
                    education.map((item, index) => {
                      const duration = [item.startYear || item.years, item.endYear].filter(Boolean).join(' - ')
                      return (
                        <div key={`edu-${index}`} className={`${selectedTemplate === 'ats' ? 'border-b border-slate-200 bg-white p-4' : 'rounded-3xl border border-slate-200 bg-slate-50 p-4'}`}>
                          <p className="text-sm font-semibold text-slate-900">{item.degree || ''}</p>
                          <p className="text-sm text-slate-600">{item.university || ''}</p>
                          {duration && <p className="text-sm text-slate-500">{duration}</p>}
                          {item.gpa && <p className="text-sm text-slate-500">GPA: {item.gpa}</p>}
                        </div>
                      )
                    })
                  ) : (
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">No education entries yet.</div>
                  )}
                </div>
              </section>

              <section className={`${template.contentCard}`}>
                <div className={`mb-4 flex flex-col gap-2 ${selectedTemplate === 'professional' ? 'lg:flex-row lg:items-center lg:justify-between' : ''}`}>
                  <h3 className={`text-sm font-semibold uppercase tracking-[0.2em] ${template.title}`}>Experience</h3>
                  {selectedTemplate === 'executive' && <span className="text-sm text-slate-500">Executive experience highlights</span>}
                </div>
                <div className="space-y-4">
                  {experience.map((item, index) => (
                    <div key={`exp-${index}`} className={`${selectedTemplate === 'ats' ? 'border-b border-slate-200 bg-white p-4' : 'rounded-3xl border border-slate-200 bg-slate-50 p-4'}`}>
                      <p className="text-sm font-semibold text-slate-900">{item.role || item.jobTitle || ''}</p>
                      <p className="text-sm text-slate-600">{item.company || ''}</p>
                      {(item.duration || item.startDate || item.endDate) && (
                        <p className="text-sm text-slate-500">{item.duration || [item.startDate, item.endDate].filter(Boolean).join(' - ')}</p>
                      )}
                      {item.description || item.responsibilities ? (
                        <p className="mt-2 text-sm leading-7 text-slate-700">{item.description || item.responsibilities}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>

              <section className={`${template.contentCard}`}>
                <h3 className={`mb-4 text-sm font-semibold uppercase tracking-[0.2em] ${template.title}`}>Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">{skill}</span>
                  ))}
                </div>
              </section>

              {(Array.isArray(data?.references) && data.references.length > 0) ? (
                <section className={`${template.contentCard}`}>
                  <h3 className={`mb-4 text-sm font-semibold uppercase tracking-[0.2em] ${template.title}`}>References</h3>
                  <div className="space-y-3">
                    {data.references.map((r, i) => (
                      <div key={`ref-${i}`} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-900">{r.name}</p>
                        <p className="text-sm text-slate-600">{[r.position, r.company].filter(Boolean).join(' • ')}</p>
                        <p className="text-sm text-slate-500">{[r.email, r.phone].filter(Boolean).join(' • ')}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {(projects.length > 0) ? (
                <section className={`${template.contentCard}`}>
                  <h3 className={`mb-4 text-sm font-semibold uppercase tracking-[0.2em] ${template.title}`}>Projects</h3>
                  <div className="space-y-4">
                    {projects.map((item, index) => (
                      <div key={`project-${index}`} className={`${selectedTemplate === 'ats' ? 'border-b border-slate-200 bg-white p-4' : 'rounded-3xl border border-slate-200 bg-slate-50 p-4'}`}>
                        <p className="text-sm font-semibold text-slate-900">{item.name || item.title || item.projectName || ''}</p>
                        {(item.duration || item.technologies) ? (
                          <p className="mt-1 text-sm text-slate-600">{[item.duration, item.technologies].filter(Boolean).join(' • ')}</p>
                        ) : null}
                        {item.description ? <p className="mt-2 text-sm leading-7 text-slate-700">{item.description}</p> : null}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {(Array.isArray(data?.languages) && data.languages.length > 0) ? (
                <section className={`${template.contentCard}`}>
                  <h3 className={`mb-4 text-sm font-semibold uppercase tracking-[0.2em] ${template.title}`}>Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.languages.map((l, i) => (
                      <span key={`lang-${i}`} className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">{l.name} — {l.proficiency}</span>
                    ))}
                  </div>
                </section>
              ) : null}

              {Array.isArray(data?.achievements) && data.achievements.length > 0 && (
                <section className={`${template.contentCard}`}>
                  <h3 className={`mb-4 text-sm font-semibold uppercase tracking-[0.2em] ${template.title}`}>Achievements</h3>
                  <div className="space-y-2">
                    {data.achievements.map((a, i) => (
                      <div key={`ach-${i}`} className="text-sm text-slate-700">{a.title || a}</div>
                    ))}
                  </div>
                </section>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
